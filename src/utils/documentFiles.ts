// Uploads store <timestamp>_SENSITIVE_<name>; older files may omit the timestamp.
export function isSensitiveDocument(name: string) {
  return /^(?:\d+_)?SENSITIVE_/.test(name);
}

export const MAX_DOCUMENT_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_DOCUMENT_NAME_LENGTH = 180;

export function getDocumentNameParts(name: string) {
  const match = name.match(/\.[a-zA-Z0-9]{1,20}$/);
  const extension = match && match.index !== 0 ? match[0] : '';
  return {
    baseName: extension ? name.slice(0, -extension.length) : name,
    extension,
  };
}

export function validateDocumentName(name: string) {
  const trimmed = name.trim();
  const { baseName } = getDocumentNameParts(trimmed);
  if (!baseName.trim() || /^\.+$/.test(baseName.trim())) {
    throw new Error('Enter a name for this document.');
  }
  if (trimmed.length > MAX_DOCUMENT_NAME_LENGTH) {
    throw new Error(`Use ${MAX_DOCUMENT_NAME_LENGTH} characters or fewer.`);
  }
  // Keep display names readable without accepting paths or control characters.
  // eslint-disable-next-line no-control-regex
  if (/[\\/:\u0000-\u001f\u007f]/.test(trimmed)) {
    throw new Error('Names cannot contain /, \\, : or line breaks.');
  }
  return trimmed;
}

export function getDocumentDisplayName(file: {
  name: string;
  displayName?: string;
}) {
  return file.displayName ?? file.name.replace('SENSITIVE_', '');
}

const SENSITIVE_PREFIX = 'SENSITIVE_';
const MAX_STORAGE_FILENAME_LENGTH = 180;
let uploadSequence = 0;

// Storage keys use a single ASCII filename segment. Keep the blur marker and
// conventional extension separate so sanitizing/truncating cannot remove them.
export function sanitizeStorageFilename(fileName: string) {
  const sensitive = fileName.startsWith(SENSITIVE_PREFIX);
  const prefix = sensitive ? SENSITIVE_PREFIX : '';
  const normalized = (sensitive ? fileName.slice(prefix.length) : fileName)
    .normalize('NFKD')
    .replace(/\p{M}/gu, '');
  const extensionMatch = normalized.match(/\.([a-zA-Z0-9]{1,20})$/);
  const extension = extensionMatch ? extensionMatch[0] : '';
  const base = extension ? normalized.slice(0, -extension.length) : normalized;
  const safeBase =
    base.replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^[_-]+|[_-]+$/g, '') ||
    'document';
  const maxBaseLength =
    MAX_STORAGE_FILENAME_LENGTH - prefix.length - extension.length;

  return `${prefix}${safeBase.slice(0, maxBaseLength)}${extension}`;
}

export function createDocumentStorageFilename(fileName: string) {
  const safeName = sanitizeStorageFilename(fileName);
  const sensitive = safeName.startsWith(SENSITIVE_PREFIX);
  const prefix = sensitive ? SENSITIVE_PREFIX : '';
  // The sequence distinguishes same-millisecond uploads even if randomness
  // repeats. upsert:false remains the final protection against overwriting.
  const nonce = `${(++uploadSequence).toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  return `${Date.now()}_${prefix}${nonce}_${safeName.slice(prefix.length)}`;
}
