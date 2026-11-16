type UploadErrorCategory =
  | 'invalid-key'
  | 'permission'
  | 'missing-bucket'
  | 'too-large'
  | 'network'
  | 'unknown';

const uploadErrors: Record<
  UploadErrorCategory,
  { message: string; userMessage: string }
> = {
  'invalid-key': {
    message: 'Storage rejected the object key.',
    userMessage: 'This filename could not be uploaded. Try renaming the file.',
  },
  permission: {
    message: 'Authentication or Storage permissions denied the upload.',
    userMessage:
      'Upload permission was denied. Please sign in again or contact support.',
  },
  'missing-bucket': {
    message: 'The document bucket was not found or is inaccessible.',
    userMessage: 'Document storage is unavailable. Please contact support.',
  },
  'too-large': {
    message: 'The file exceeds an upload size limit.',
    userMessage: 'This file is too large to upload. Choose a smaller file.',
  },
  network: {
    message: 'A network request failed during upload.',
    userMessage: 'Could not connect. Check your connection and try again.',
  },
  unknown: {
    message: 'The document upload failed.',
    userMessage: 'Could not upload the file. Please try again.',
  },
};

export function getDocumentUploadError(error: unknown) {
  const details =
    typeof error === 'object' && error !== null
      ? (error as Record<string, unknown>)
      : {};
  const rawCode = details.code ?? details.error ?? details.statusCode;
  const code =
    typeof rawCode === 'string' && /^[a-zA-Z][a-zA-Z0-9_]{0,63}$/.test(rawCode)
      ? rawCode
      : undefined;
  const rawStatus =
    details.status ?? details.httpStatusCode ?? details.statusCode;
  const status = Number(rawStatus);
  const httpStatus =
    Number.isInteger(status) && status >= 0 && status <= 599
      ? status
      : undefined;
  const message =
    typeof details.message === 'string'
      ? details.message
      : typeof error === 'string'
        ? error
        : '';
  const signature = `${code ?? ''} ${message}`.toLowerCase();
  let category: UploadErrorCategory = 'unknown';

  if (/invalid.?key/.test(signature)) {
    category = 'invalid-key';
  } else if (
    /nosuchbucket|bucket.*(?:not found|does not exist)/.test(signature)
  ) {
    category = 'missing-bucket';
  } else if (
    httpStatus === 413 ||
    /entitytoolarge|payload.?too.?large|file.*too large|maximum.*size|exceeds.*limit/.test(
      signature,
    )
  ) {
    category = 'too-large';
  } else if (
    httpStatus === 401 ||
    httpStatus === 403 ||
    /access.?denied|unauthorized|not authenticated|invalid.?jwt|row.level security|permission denied|42501/.test(
      signature,
    )
  ) {
    category = 'permission';
  } else if (
    httpStatus === 0 ||
    /network|failed to fetch|fetch failed|load failed|timeout|econn/.test(
      signature,
    )
  ) {
    category = 'network';
  }

  // Raw SDK messages can contain object paths, original filenames, URLs, and
  // credentials. Log a normalized reason and structured codes instead.
  return { category, code, status: httpStatus, ...uploadErrors[category] };
}
