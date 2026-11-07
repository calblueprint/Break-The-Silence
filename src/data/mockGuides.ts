import type { Guide } from './guidesTypes';

export const mockGuides: Guide[] = [
  {
    id: 'guide-risk-assessment',
    slug: 'domestic-violence-risk-assessment-toolkit',
    title: 'Domestic Violence Risk Assessment Toolkit',
    category: 'self-development',
    description:
      'Recognizing the risks associated with domestic violence is crucial for survivors to make informed decisions about their safety. This toolkit provides guidance on assessing danger levels, identifying warning signs, and accessing essential resources to develop a personalized safety plan.',
    sections: [
      {
        id: 'risk-toc',
        title: 'Table of Contents',
        blocks: [
          {
            id: 'risk-toc-list',
            type: 'list',
            style: 'number',
            items: [
              { id: 'risk-toc-1', text: 'Understanding Risk Assessment' },
              { id: 'risk-toc-2', text: 'Recognizing High-Risk Indicators' },
              { id: 'risk-toc-3', text: 'Lethality Screening Tools' },
              { id: 'risk-toc-4', text: 'Risk Assessment Questionnaire' },
              { id: 'risk-toc-5', text: 'Creating a Personalized Safety Plan' },
              {
                id: 'risk-toc-6',
                text: 'Emergency Planning & Crisis Response',
              },
              {
                id: 'risk-toc-7',
                text: 'Legal Protections & Law Enforcement Support',
              },
              {
                id: 'risk-toc-8',
                text: 'Technology Safety & Digital Risk Assessment',
              },
              { id: 'risk-toc-9', text: 'Resources for Ongoing Support' },
            ],
          },
        ],
      },
      {
        id: 'risk-1',
        title: 'Understanding Risk Assessment',
        blocks: [
          {
            id: 'risk-1-list',
            type: 'list',
            style: 'bullet',
            items: [
              {
                id: 'risk-1-a',
                text: 'The importance of assessing risk in abusive situations.',
              },
              { id: 'risk-1-b', text: 'How risk levels can change over time.' },
              {
                id: 'risk-1-c',
                text: 'Understanding patterns of escalation in domestic violence.',
              },
            ],
          },
        ],
      },
      {
        id: 'risk-2',
        title: 'Recognizing High-Risk Indicators',
        blocks: [
          {
            id: 'risk-2-list',
            type: 'list',
            style: 'bullet',
            items: [
              {
                id: 'risk-2-a',
                text: 'Common warning signs of escalating abuse.',
              },
              {
                id: 'risk-2-b',
                text: 'Factors that increase danger (e.g., threats of homicide, strangulation, access to weapons).',
              },
              { id: 'risk-2-c', text: 'Behavioral red flags from abusers.' },
            ],
          },
        ],
      },
      {
        id: 'risk-3',
        title: 'Lethality Screening Tools',
        blocks: [
          {
            id: 'risk-3-list',
            type: 'list',
            style: 'bullet',
            items: [
              {
                id: 'risk-3-a',
                text: 'The Danger Assessment Tool (Dr. Jacquelyn Campbell’s risk assessment).',
              },
              {
                id: 'risk-3-b',
                text: 'The Ontario Domestic Assault Risk Assessment (ODARA).',
              },
              {
                id: 'risk-3-c',
                text: 'How survivors can use these tools to understand their risk levels.',
              },
            ],
          },
        ],
      },
      {
        id: 'risk-4',
        title: 'Risk Assessment Questionnaire',
        blocks: [
          {
            id: 'risk-4-intro',
            type: 'text',
            content:
              'This self-assessment can help survivors evaluate their level of risk. Answer ‘Yes’ or ‘No’ to the following questions:',
          },
          {
            id: 'risk-4-questions',
            type: 'list',
            style: 'number',
            items: [
              {
                id: 'risk-q1',
                text: 'Has your partner ever threatened to kill you or themselves?',
              },
              {
                id: 'risk-q2',
                text: 'Has your partner ever strangled or choked you?',
              },
              {
                id: 'risk-q3',
                text: 'Does your partner have access to weapons?',
              },
              {
                id: 'risk-q4',
                text: 'Has the violence increased in severity or frequency?',
              },
              {
                id: 'risk-q5',
                text: 'Does your partner control your finances or monitor your activities?',
              },
              {
                id: 'risk-q6',
                text: 'Do you feel unsafe leaving or ending the relationship?',
              },
              {
                id: 'risk-q7',
                text: 'Has your partner ever hurt your children or pets?',
              },
              {
                id: 'risk-q8',
                text: 'Has your partner forced you to engage in sexual activities against your will?',
              },
              {
                id: 'risk-q9',
                text: 'Do you feel isolated from friends, family, or support systems?',
              },
              {
                id: 'risk-q10',
                text: 'Has your partner threatened or stalked you after a separation?',
              },
            ],
          },
          {
            id: 'risk-4-outro',
            type: 'text',
            content:
              'If you answered ‘Yes’ to multiple questions, it may indicate a higher level of risk, and seeking professional support is strongly recommended.',
          },
          {
            id: 'risk-4-note',
            type: 'callout',
            variant: 'info',
            title: 'Important',
            content:
              'This is not a validated scoring tool. Even one concerning experience can warrant support. A trained advocate can help discuss safety options without assigning a risk score.',
          },
        ],
      },
      {
        id: 'risk-5',
        title: 'Creating a Personalized Safety Plan',
        blocks: [
          {
            id: 'risk-5-list',
            type: 'list',
            style: 'bullet',
            items: [
              {
                id: 'risk-5-a',
                text: 'Identifying safe exits and escape routes.',
              },
              {
                id: 'risk-5-b',
                text: 'Developing a code word system for emergency situations.',
              },
              {
                id: 'risk-5-c',
                text: 'Preparing essential documents and emergency bags.',
              },
            ],
          },
        ],
      },
      {
        id: 'risk-6',
        title: 'Emergency Planning & Crisis Response',
        blocks: [
          {
            id: 'risk-6-list',
            type: 'list',
            style: 'bullet',
            items: [
              { id: 'risk-6-a', text: 'Steps to take in immediate danger.' },
              {
                id: 'risk-6-b',
                text: 'How to contact local shelters and crisis hotlines.',
              },
              {
                id: 'risk-6-c',
                text: 'Developing a plan for children and pets.',
              },
            ],
          },
        ],
      },
      {
        id: 'risk-7',
        title: 'Legal Protections & Law Enforcement Support',
        blocks: [
          {
            id: 'risk-7-list',
            type: 'list',
            style: 'bullet',
            items: [
              {
                id: 'risk-7-a',
                text: 'Understanding restraining orders and protection orders.',
              },
              {
                id: 'risk-7-b',
                text: 'When and how to involve law enforcement.',
              },
              {
                id: 'risk-7-c',
                text: 'Seeking legal aid and advocacy services.',
              },
            ],
          },
        ],
      },
      {
        id: 'risk-8',
        title: 'Technology Safety & Digital Risk Assessment',
        blocks: [
          {
            id: 'risk-8-list',
            type: 'list',
            style: 'bullet',
            items: [
              {
                id: 'risk-8-a',
                text: 'How abusers use technology for tracking and harassment.',
              },
              {
                id: 'risk-8-b',
                text: 'Tips for securing devices and online accounts.',
              },
              {
                id: 'risk-8-c',
                text: 'Using secure communication methods and digital safety apps.',
              },
            ],
          },
        ],
      },
      {
        id: 'risk-9',
        title: 'Resources for Ongoing Support',
        headingSize: 'large',
        blocks: [
          {
            id: 'risk-resource-1',
            type: 'resource',
            title: 'National Domestic Violence Hotline',
            url: 'https://www.thehotline.org',
            phone: '800-799-7233',
          },
          {
            id: 'risk-resource-2',
            type: 'resource',
            title: 'Danger Assessment Tool',
            url: 'https://www.dangerassessment.org',
          },
          {
            id: 'risk-resource-3',
            type: 'resource',
            title: 'WomensLaw Legal Help',
            url: 'https://www.womenslaw.org',
          },
          {
            id: 'risk-resource-4',
            type: 'resource',
            title: 'Local Shelters & Advocacy Programs',
            description: 'Search for local services and shelter programs.',
            url: 'https://www.domesticshelters.org',
          },
          {
            id: 'risk-resource-5',
            type: 'resource',
            title: 'Tech Safety Tips',
            url: 'https://www.techsafety.org',
          },
        ],
      },
    ],
  },
  {
    id: 'guide-healthy-relationships',
    slug: 'building-healthy-relationships-after-domestic-violence',
    title: 'Building Healthy Relationships After Domestic Violence',
    category: 'support',
    description: 'A Guide to Healing, Trust, and Healthy Connections',
    // The source screenshots have inconsistent numbering/headings: the TOC calls
    // section 1 'Introduction to Healthy Relationships', while the body calls it
    // 'Understanding Healthy vs. Unhealthy Relationships'. The body also contains
    // two 'Setting Relationship Goals' sections (5 and 6) and a seventh resources
    // section. Both goal sections are retained here to preserve source content.
    sections: [
      {
        id: 'healthy-1',
        title: 'Understanding Healthy vs. Unhealthy Relationships',
        blocks: [
          {
            id: 'healthy-1-intro',
            type: 'text',
            content:
              'After experiencing domestic violence, it’s important to redefine what a healthy relationship looks like. It’s common for survivors to struggle with trust, boundaries, and self-worth. This section will help identify the traits of healthy vs. unhealthy relationships.',
          },
          {
            id: 'healthy-1-good',
            type: 'list',
            title: 'Healthy Relationship Signs',
            style: 'emoji',
            items: [
              {
                id: 'healthy-good-1',
                emoji: '✅',
                text: 'Open and honest communication',
              },
              {
                id: 'healthy-good-2',
                emoji: '✅',
                text: 'Mutual respect and support',
              },
              { id: 'healthy-good-3', emoji: '✅', text: 'Trust and honesty' },
              {
                id: 'healthy-good-4',
                emoji: '✅',
                text: 'Shared decision-making',
              },
              {
                id: 'healthy-good-5',
                emoji: '✅',
                text: 'Emotional safety and personal growth',
              },
            ],
          },
          {
            id: 'healthy-1-red',
            type: 'list',
            title: 'Red Flags to Watch For',
            style: 'emoji',
            items: [
              {
                id: 'healthy-red-1',
                emoji: '❌',
                text: 'Control over your actions, clothing, or friendships',
              },
              {
                id: 'healthy-red-2',
                emoji: '❌',
                text: 'Disrespectful or demeaning behavior',
              },
              {
                id: 'healthy-red-3',
                emoji: '❌',
                text: 'Gaslighting or making you doubt your reality',
              },
              {
                id: 'healthy-red-4',
                emoji: '❌',
                text: 'Physical, emotional, or verbal abuse',
              },
            ],
          },
          {
            id: 'healthy-1-reflection-heading',
            type: 'heading',
            text: 'Reflect on relationship qualities',
            level: 3,
          },
          {
            id: 'healthy-1-reflection-content',
            type: 'text',
            content:
              'Write down your ideal qualities in a partner and compare them with past relationships. Identify any warning signs you may have missed.',
          },
        ],
      },
      {
        id: 'healthy-2',
        title: 'Rebuilding Self-Worth & Setting Boundaries',
        blocks: [
          {
            id: 'healthy-2-intro',
            type: 'text',
            content:
              'After leaving an abusive relationship, rebuilding self-esteem is crucial. Trauma can make it difficult to trust yourself and others. Here’s how to start healing:',
          },
          {
            id: 'healthy-2-worth',
            type: 'list',
            title: 'Building Self-Worth',
            style: 'emoji',
            items: [
              {
                id: 'healthy-worth-1',
                emoji: '🔹',
                text: 'Self-Compassion: Speak to yourself with kindness and patience.',
              },
              {
                id: 'healthy-worth-2',
                emoji: '🔹',
                text: 'Practice Self-Care: Prioritize rest, exercise, and activities that bring you joy.',
              },
              {
                id: 'healthy-worth-3',
                emoji: '🔹',
                text: 'Identify Your Strengths: What are your talents and qualities? Write them down.',
              },
              {
                id: 'healthy-worth-4',
                emoji: '🔹',
                text: 'Surround Yourself with Support – Stay connected with positive, uplifting people.',
              },
            ],
          },
          {
            id: 'healthy-2-boundary-intro',
            type: 'text',
            content:
              'Setting Healthy Boundaries: Setting boundaries means standing up for what you need and deserve. Examples:',
          },
          {
            id: 'healthy-2-boundaries',
            type: 'list',
            style: 'check',
            items: [
              {
                id: 'healthy-boundary-1',
                text: 'I need personal space when I’m upset.',
              },
              {
                id: 'healthy-boundary-2',
                text: 'I won’t accept being yelled at or insulted.',
              },
              {
                id: 'healthy-boundary-3',
                text: 'I expect honesty and open communication.',
              },
            ],
          },
          {
            id: 'healthy-2-boundaries-heading',
            type: 'heading',
            text: 'Define your boundaries',
            level: 3,
          },
          {
            id: 'healthy-2-boundaries-content',
            type: 'text',
            content:
              'Write down three non-negotiable boundaries for any future relationships. What are your limits? What will you do if someone crosses them?',
          },
        ],
      },
      {
        id: 'healthy-3',
        title: 'Recognizing Red Flags in Future Relationships',
        blocks: [
          {
            id: 'healthy-3-intro',
            type: 'text',
            content:
              'Being aware of warning signs can help you avoid toxic relationships in the future.',
          },
          {
            id: 'healthy-3-list',
            type: 'list',
            title: 'Common Red Flags',
            style: 'emoji',
            items: [
              {
                id: 'healthy-flag-1',
                emoji: '🚩',
                text: 'Controlling behavior (deciding who you can see or talk to)',
              },
              {
                id: 'healthy-flag-2',
                emoji: '🚩',
                text: 'Jealousy & possessiveness',
              },
              {
                id: 'healthy-flag-3',
                emoji: '🚩',
                text: 'Quick involvement & intense early commitment',
              },
              {
                id: 'healthy-flag-4',
                emoji: '🚩',
                text: 'Blaming others for their problems or emotions',
              },
              {
                id: 'healthy-flag-5',
                emoji: '🚩',
                text: 'Manipulation, guilt-tripping, or gaslighting',
              },
              {
                id: 'healthy-flag-6',
                emoji: '🚩',
                text: 'Dismissing or disrespecting your boundaries',
              },
            ],
          },
          {
            id: 'healthy-3-relationship-reflection',
            type: 'text',
            content:
              'Make a list of what a healthy vs. unhealthy relationship looks like to you.',
          },
        ],
      },
      {
        id: 'healthy-4',
        title: 'Effective Communication & Conflict Resolution',
        blocks: [
          {
            id: 'healthy-4-communication',
            type: 'list',
            title: 'Communicating in a Healthy Way',
            style: 'check',
            items: [
              {
                id: 'healthy-com-1',
                text: 'Use ‘I’ statements (e.g., I feel... instead of ‘You always...’)',
              },
              {
                id: 'healthy-com-2',
                text: 'Actively listen—don’t just wait to speak.',
              },
              {
                id: 'healthy-com-3',
                text: 'Take a break if emotions get too high.',
              },
              {
                id: 'healthy-com-4',
                text: 'Express needs clearly and directly.',
              },
            ],
          },
          {
            id: 'healthy-4-disagreement',
            type: 'list',
            title: 'Handling Disagreements in a Healthy Way',
            style: 'check',
            items: [
              {
                id: 'healthy-dis-1',
                text: 'Focus on the issue, not personal attacks.',
              },
              {
                id: 'healthy-dis-2',
                text: 'Use ‘I’ statements to express your feelings.',
              },
              {
                id: 'healthy-dis-3',
                text: 'Take timeouts if emotions get too intense.',
              },
              {
                id: 'healthy-dis-4',
                text: 'Look for win-win solutions. Healthy relationships don’t require power struggles.',
              },
            ],
          },
          {
            id: 'healthy-4-worksheet',
            type: 'resource',
            title: 'Effective Communication Guide',
            description:
              'Worksheet: downloadable PDF. Add the actual PDF URL once uploaded to Supabase Storage.',
          },
        ],
      },
      {
        id: 'healthy-5',
        title: 'Setting Relationship Goals',
        blocks: [
          {
            id: 'healthy-5-intro',
            type: 'text',
            content:
              'Moving forward after an abusive relationship is challenging, but setting clear relationship goals helps guide your choices.',
          },
          {
            id: 'healthy-5-questions',
            type: 'list',
            title: 'Questions to Ask Yourself',
            style: 'emoji',
            items: [
              {
                id: 'healthy-goal-q1',
                emoji: '❓',
                text: 'What do I want in a future partner?',
              },
              {
                id: 'healthy-goal-q2',
                emoji: '❓',
                text: 'How do I want to feel in my next relationship?',
              },
              {
                id: 'healthy-goal-q3',
                emoji: '❓',
                text: 'What boundaries will I set and enforce?',
              },
              {
                id: 'healthy-goal-q4',
                emoji: '❓',
                text: 'How will I take care of myself in a relationship?',
              },
            ],
          },
          {
            id: 'healthy-5-future-letter-heading',
            type: 'heading',
            text: 'Write a letter to your future self',
            level: 3,
          },
          {
            id: 'healthy-5-future-letter-content',
            type: 'text',
            content:
              'Write about what you want from your next relationship, including your goals, values, and boundaries.',
          },
        ],
      },
      {
        id: 'healthy-6',
        title: 'Setting Relationship Goals',
        blocks: [
          {
            id: 'healthy-6-intro',
            type: 'text',
            content:
              'Healthy relationships require clear expectations and communication.',
          },
          {
            id: 'healthy-6-steps',
            type: 'list',
            title: 'Steps to Building a Strong Relationship',
            style: 'number',
            items: [
              {
                id: 'healthy-step-1',
                text: 'Know Your Boundaries – Clearly communicate your needs and limits.',
              },
              {
                id: 'healthy-step-2',
                text: 'Prioritize Emotional Safety – Does this person make you feel safe, supported, and heard?',
              },
              {
                id: 'healthy-step-3',
                text: 'Practice Self-Care – A healthy relationship should help you grow as an individual, too.',
              },
              {
                id: 'healthy-step-4',
                text: 'Be Open About Dealbreakers – Discuss finances, children, conflict resolution styles, and future goals early in the relationship.',
              },
              {
                id: 'healthy-step-5',
                text: 'Ensure Reciprocity – Both partners should equally give and receive respect, effort, and love.',
              },
            ],
          },
          {
            id: 'healthy-6-book',
            type: 'resource',
            title: 'Attached: The New Science of Adult Attachment',
            description: 'Book by Amir Levine and Rachel Heller.',
          },
        ],
      },
      {
        id: 'healthy-7',
        title: 'Additional Resources & Support',
        headingSize: 'large',
        blocks: [
          {
            id: 'healthy-7-community',
            type: 'resource',
            title: 'BTSADV Peer Support Groups',
            description:
              'Online communities; the screenshot references a free group and a website link, but no working URL was supplied.',
          },
          {
            id: 'healthy-7-therapy',
            type: 'text',
            content:
              'Therapy & Support Groups – Local domestic violence organizations can help with finding trauma-informed therapists.',
          },
          {
            id: 'healthy-7-book',
            type: 'resource',
            title: 'Why Does He Do That?',
            description: 'Book by Lundy Bancroft.',
          },
          {
            id: 'healthy-7-hotline',
            type: 'resource',
            title: 'National Domestic Violence Hotline',
            description: '24/7 confidential support.',
            phone: '800-799-7233',
            url: 'https://www.thehotline.org',
          },
          {
            id: 'healthy-7-legal',
            type: 'resource',
            title: 'Helplines & Legal Aid Resources',
            description:
              'Include relevant national helpline and legal aid resources; location-specific entries still need to be supplied.',
          },
          {
            id: 'healthy-7-planner',
            type: 'resource',
            title: 'Self-Care Planner',
            description:
              'A downloadable workbook to help prioritize self-care and emotional healing. Add the actual file URL once available.',
          },
        ],
      },
    ],
  },
  {
    id: 'test-guide',
    slug: 'component-guide',
    title: 'Component Guide',
    category: 'self-improvement',
    description: 'Component Guide Description hHre.',
    sections: [
      {
        id: 'test-section-text',
        title: 'TextBlock',
        blocks: [
          {
            id: 'test-text',
            type: 'text',
            content: 'This is an example text block.',
          },
        ],
      },
      {
        id: 'test-section-list',
        title: 'ListBlock',
        blocks: [
          {
            id: 'test-list',
            type: 'list',
            style: 'bullet',
            items: [
              { id: 'test-list-item-1', text: 'First example item' },
              { id: 'test-list-item-2', text: 'Second example item' },
            ],
          },
        ],
      },
      {
        id: 'test-section-callout',
        title: 'CalloutBlock',
        blocks: [
          {
            id: 'test-callout',
            type: 'callout',
            title: 'Example callout',
            content: 'This is a basic informational callout.',
            variant: 'info',
          },
        ],
      },
      {
        id: 'test-section-resource',
        title: 'ResourceBlock',
        blocks: [
          {
            id: 'test-resource',
            type: 'resource',
            title: 'Example resource',
            description: 'A sample resource with a website link.',
            url: 'https://example.com',
          },
        ],
      },
      {
        id: 'test-section-image',
        title: 'ImageBlock',
        blocks: [
          {
            id: 'test-image',
            type: 'image',
            src: 'https://placehold.co/600x400/png?text=Example+Image',
            alt: 'Example placeholder image',
            caption: 'image caption',
          },
        ],
      },
    ],
  },
];

export default mockGuides;
