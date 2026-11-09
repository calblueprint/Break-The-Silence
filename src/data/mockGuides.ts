import type { Guide } from './guidesTypes';

export const mockGuides: Guide[] = [
  {
    id: 'guide-risk-assessment',
    slug: 'domestic-violence-risk-assessment-toolkit',
    title: 'Domestic Violence Risk Assessment Toolkit',
    category: 'Safety',
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

  // ───────────────────────── NEW: Survivor Safety Planning Toolkit ─────────────────────────
  {
    id: 'guide-safety-planning',
    slug: 'survivor-safety-planning-toolkit',
    title: 'Survivor Safety Planning Toolkit',
    category: 'Safety',
    description:
      'A Guide to Protecting Yourself Before, During, and After Leaving an Abuser',
    sections: [
      {
        id: 'safety-toc',
        title: 'Table of Contents',
        blocks: [
          {
            id: 'safety-toc-list',
            type: 'list',
            style: 'number',
            items: [
              { id: 'safety-toc-1', text: 'Understanding Safety Planning' },
              {
                id: 'safety-toc-2',
                text: 'Immediate Safety Plan (In Danger Right Now)',
              },
              { id: 'safety-toc-3', text: 'Planning to Leave' },
              {
                id: 'safety-toc-4',
                text: 'Safety While Living with an Abuser',
              },
              { id: 'safety-toc-5', text: 'Digital Safety' },
              { id: 'safety-toc-6', text: 'Safety After Leaving' },
              {
                id: 'safety-toc-7',
                text: 'Emergency Contact List & Resources',
              },
            ],
          },
        ],
      },
      {
        id: 'safety-1',
        title: 'Understanding Safety Planning',
        blocks: [
          {
            id: 'safety-1-intro',
            type: 'text',
            content:
              'A safety plan is a personalized strategy to help you stay safe from an abuser. Whether you are staying, planning to leave, or have already left, this toolkit provides step-by-step guidance on reducing risk.',
          },
          {
            id: 'safety-1-key',
            type: 'list',
            title: 'Key Considerations',
            style: 'check',
            items: [
              {
                id: 'safety-1-a',
                text: 'Every survivor’s situation is different—adapt the plan to your needs.',
              },
              {
                id: 'safety-1-b',
                text: 'Keep your safety plan in a place where your abuser can’t find it.',
              },
              {
                id: 'safety-1-c',
                text: 'Trust your instincts and seek support when needed.',
              },
            ],
          },
        ],
      },
      {
        id: 'safety-2',
        title: 'Immediate Safety Plan (In Danger Right Now)',
        blocks: [
          {
            id: 'safety-2-list',
            type: 'list',
            title: 'If you are in immediate danger:',
            style: 'bullet',
            items: [
              { id: 'safety-2-a', text: 'Call 911 (if safe to do so).' },
              {
                id: 'safety-2-b',
                text: 'Get to a safe room with an exit (avoid kitchens, bathrooms, or garages where weapons may be present).',
              },
              {
                id: 'safety-2-c',
                text: 'Use a code word to alert trusted friends/family.',
              },
              {
                id: 'safety-2-d',
                text: 'Memorize emergency contacts in case your phone is taken.',
              },
              {
                id: 'safety-2-e',
                text: 'If you must leave quickly, take only essential items (keys, ID, cash, phone).',
              },
            ],
          },
        ],
      },
      {
        id: 'safety-3',
        title: 'Planning to Leave',
        blocks: [
          {
            id: 'safety-3-callout',
            type: 'callout',
            variant: 'info',
            title: 'Important',
            content:
              'Leaving an abuser is the most dangerous time. Careful planning can increase safety.',
          },
          {
            id: 'safety-3-gobag',
            type: 'list',
            title: 'Things to Pack in a Go-Bag',
            style: 'emoji',
            items: [
              {
                id: 'safety-bag-1',
                emoji: '☐',
                text: 'Birth certificates & IDs (yours & children’s)',
              },
              { id: 'safety-bag-2', emoji: '☐', text: 'Social Security cards' },
              {
                id: 'safety-bag-3',
                emoji: '☐',
                text: 'Cash & prepaid debit cards',
              },
              { id: 'safety-bag-4', emoji: '☐', text: 'Extra set of car keys' },
              {
                id: 'safety-bag-5',
                emoji: '☐',
                text: 'Medication & medical records',
              },
              {
                id: 'safety-bag-6',
                emoji: '☐',
                text: 'Legal documents (restraining orders, custody papers)',
              },
              {
                id: 'safety-bag-7',
                emoji: '☐',
                text: 'Emergency phone with prepaid minutes',
              },
              {
                id: 'safety-bag-8',
                emoji: '☐',
                text: 'Important phone numbers written on paper',
              },
            ],
          },
          {
            id: 'safety-3-places',
            type: 'list',
            title: 'Safe Places to Go',
            style: 'emoji',
            items: [
              {
                id: 'safety-place-1',
                emoji: '🏠',
                text: 'Trusted friend or family member’s home',
              },
              {
                id: 'safety-place-2',
                emoji: '🏠',
                text: 'Domestic violence shelter',
              },
              {
                id: 'safety-place-3',
                emoji: '🏠',
                text: 'Local police station (if seeking immediate protection)',
              },
              {
                id: 'safety-place-4',
                emoji: '🏠',
                text: 'Hospital (if injured)',
              },
            ],
          },
          {
            id: 'safety-3-leave',
            type: 'list',
            title: 'How to Leave Safely',
            style: 'check',
            items: [
              {
                id: 'safety-leave-1',
                text: 'Timing Matters: Leave when your abuser is least likely to notice.',
              },
              {
                id: 'safety-leave-2',
                text: 'Turn Off Location Tracking: Disable GPS on devices.',
              },
              {
                id: 'safety-leave-3',
                text: 'Have a Support System: Tell trusted people about your plan.',
              },
              {
                id: 'safety-leave-4',
                text: 'Change Routines: Avoid predictable schedules after leaving.',
              },
            ],
          },
        ],
      },
      {
        id: 'safety-4',
        title: 'Safety While Living with an Abuser',
        blocks: [
          {
            id: 'safety-4-list',
            type: 'list',
            title: 'If you cannot leave yet:',
            style: 'bullet',
            items: [
              {
                id: 'safety-4-a',
                text: 'Identify safe areas in your home where there are no weapons.',
              },
              {
                id: 'safety-4-b',
                text: 'Keep your phone hidden and fully charged.',
              },
              {
                id: 'safety-4-c',
                text: 'Develop a code word with children or friends to signal danger.',
              },
              {
                id: 'safety-4-d',
                text: 'Avoid arguments in trapped areas (small rooms, staircases).',
              },
              {
                id: 'safety-4-e',
                text: 'Have an escape plan (know exits, have a spare key hidden).',
              },
            ],
          },
        ],
      },
      {
        id: 'safety-5',
        title: 'Digital Safety',
        blocks: [
          {
            id: 'safety-5-intro',
            type: 'text',
            content:
              'Your abuser may track your devices. Here’s how to stay safe:',
          },
          {
            id: 'safety-5-list',
            type: 'list',
            style: 'emoji',
            items: [
              {
                id: 'safety-5-a',
                emoji: '🔹',
                text: 'Secure Your Phone: Use a strong passcode and change it often.',
              },
              {
                id: 'safety-5-b',
                emoji: '🔹',
                text: 'Check for Spyware: If your abuser has had access to your phone, factory reset it.',
              },
              {
                id: 'safety-5-c',
                emoji: '🔹',
                text: 'Turn Off Location Services: Go to your settings and disable GPS tracking.',
              },
              {
                id: 'safety-5-d',
                emoji: '🔹',
                text: 'Create New Emails & Accounts: If needed, set up a new, secret email.',
              },
              {
                id: 'safety-5-e',
                emoji: '🔹',
                text: 'Use a Safe Browser: Private browsing mode prevents tracking.',
              },
            ],
          },
        ],
      },
      {
        id: 'safety-6',
        title: 'Safety After Leaving',
        blocks: [
          {
            id: 'safety-6-intro',
            type: 'text',
            content: 'Your safety doesn’t end once you leave.',
          },
          {
            id: 'safety-6-list',
            type: 'list',
            style: 'emoji',
            items: [
              {
                id: 'safety-6-a',
                emoji: '✅',
                text: 'Change Locks & Secure Your Home – Install security cameras if possible.',
              },
              {
                id: 'safety-6-b',
                emoji: '✅',
                text: 'Update Restraining Orders – Carry copies with you at all times.',
              },
              {
                id: 'safety-6-c',
                emoji: '✅',
                text: 'Alert Work & Schools – Provide a photo of your abuser to security.',
              },
              {
                id: 'safety-6-d',
                emoji: '✅',
                text: 'Vary Your Routine – Take different routes to work or school.',
              },
              {
                id: 'safety-6-e',
                emoji: '✅',
                text: 'Stay Off Social Media – Avoid posting your location or plans.',
              },
            ],
          },
        ],
      },
      {
        id: 'safety-7',
        title: 'Emergency Contact List & Resources',
        headingSize: 'large',
        blocks: [
          {
            id: 'safety-7-intro',
            type: 'text',
            content: 'Fill this out and keep a copy somewhere safe.',
          },
          {
            id: 'safety-7-fill',
            type: 'list',
            style: 'emoji',
            items: [
              {
                id: 'safety-contact-1',
                emoji: '📞',
                text: 'Local Police: ____________',
              },
              {
                id: 'safety-contact-2',
                emoji: '📞',
                text: 'DV Shelter: ____________',
              },
              {
                id: 'safety-contact-3',
                emoji: '📞',
                text: 'Safe Friend/Family Member: ____________',
              },
              {
                id: 'safety-contact-4',
                emoji: '📞',
                text: 'Legal Aid: ____________',
              },
            ],
          },
          {
            id: 'safety-7-btsadv',
            type: 'resource',
            title: 'BTSADV Support Line',
            phone: '855-287-1777', // 855-BTS-1777
          },
          {
            id: 'safety-7-hotline',
            type: 'resource',
            title: 'National Domestic Violence Hotline',
            url: 'https://www.thehotline.org',
            phone: '800-799-7233', // 800-799-SAFE
          },
        ],
      },
    ],
  },

  // ───────────────────────── NEW: Life After Abuse ─────────────────────────
  {
    id: 'guide-life-after-abuse',
    slug: 'life-after-abuse-a-survivors-guide-to-moving-forward',
    title: 'Life After Abuse: A Survivor’s Guide to Moving Forward',
    category: 'Healing',
    description:
      'Healing after abuse is a journey, and rebuilding life takes time, support, and the right resources. This toolkit is designed to help survivors navigate life after leaving an abusive relationship by providing guidance on emotional recovery, personal empowerment, and practical steps for a fresh start.',
    // Resource URLs below are organization homepages; replace with the exact
    // pages referenced in the source PDF (the screenshots show link text only).
    sections: [
      {
        id: 'life-toc',
        title: 'Table of Contents',
        blocks: [
          {
            id: 'life-toc-list',
            type: 'list',
            style: 'number',
            items: [
              { id: 'life-toc-1', text: 'Understanding the Healing Process' },
              { id: 'life-toc-2', text: 'Building a Support System' },
              {
                id: 'life-toc-3',
                text: 'Developing Self-Care & Wellness Routines',
              },
              { id: 'life-toc-4', text: 'Overcoming Trauma & PTSD' },
              { id: 'life-toc-5', text: 'Establishing Healthy Relationships' },
              {
                id: 'life-toc-6',
                text: 'Creating a Safe & Stable Home Environment',
              },
              { id: 'life-toc-7', text: 'Financial Independence & Stability' },
              { id: 'life-toc-8', text: 'Rebuilding Confidence & Self-Worth' },
              {
                id: 'life-toc-9',
                text: 'Legal Considerations & Protective Measures',
              },
              { id: 'life-toc-10', text: 'Resources for Ongoing Support' },
            ],
          },
        ],
      },
      {
        id: 'life-1',
        title: 'Understanding the Healing Process',
        blocks: [
          {
            id: 'life-1-list',
            type: 'list',
            style: 'bullet',
            items: [
              { id: 'life-1-a', text: 'The stages of healing after abuse.' },
              {
                id: 'life-1-b',
                text: 'Recognizing trauma responses and emotional triggers.',
              },
              {
                id: 'life-1-c',
                text: 'Setting realistic expectations for recovery.',
              },
            ],
          },
          {
            id: 'life-1-res',
            type: 'resource',
            title:
              'The National Domestic Violence Hotline - Understanding Trauma',
            url: 'https://www.thehotline.org',
          },
        ],
      },
      {
        id: 'life-2',
        title: 'Building a Support System',
        blocks: [
          {
            id: 'life-2-list',
            type: 'list',
            style: 'bullet',
            items: [
              {
                id: 'life-2-a',
                text: 'Identifying safe and trustworthy people for support.',
              },
              {
                id: 'life-2-b',
                text: 'Finding local and online support groups.',
              },
              {
                id: 'life-2-c',
                text: 'Seeking counseling and professional therapy options.',
              },
            ],
          },
          {
            id: 'life-2-res',
            type: 'resource',
            title:
              'Support Groups for Domestic Violence Survivors - WomensLaw.org',
            url: 'https://www.womenslaw.org',
          },
        ],
      },
      {
        id: 'life-3',
        title: 'Developing Self-Care & Wellness Routines',
        blocks: [
          {
            id: 'life-3-list',
            type: 'list',
            style: 'bullet',
            items: [
              {
                id: 'life-3-a',
                text: 'Importance of self-care in the healing journey.',
              },
              {
                id: 'life-3-b',
                text: 'Mindfulness, meditation, and stress-reducing techniques.',
              },
              {
                id: 'life-3-c',
                text: 'Exercise, nutrition, and sleep as foundational aspects of wellness.',
              },
            ],
          },
          {
            id: 'life-3-res',
            type: 'resource',
            title: 'Self-Care Guide for Trauma Survivors - Psychology Today',
            url: 'https://www.psychologytoday.com',
          },
        ],
      },
      {
        id: 'life-4',
        title: 'Overcoming Trauma & PTSD',
        blocks: [
          {
            id: 'life-4-list',
            type: 'list',
            style: 'bullet',
            items: [
              {
                id: 'life-4-a',
                text: 'Recognizing symptoms of PTSD and trauma.',
              },
              {
                id: 'life-4-b',
                text: 'Coping strategies for flashbacks, anxiety, and panic attacks.',
              },
              {
                id: 'life-4-c',
                text: 'Therapies that aid in trauma recovery (EMDR, CBT, trauma-informed therapy).',
              },
            ],
          },
          {
            id: 'life-4-res',
            type: 'resource',
            title: 'PTSD Resources - National Center for PTSD',
            url: 'https://www.ptsd.va.gov',
          },
        ],
      },
      {
        id: 'life-5',
        title: 'Establishing Healthy Relationships',
        blocks: [
          {
            id: 'life-5-list',
            type: 'list',
            style: 'bullet',
            items: [
              {
                id: 'life-5-a',
                text: 'Understanding red flags and early warning signs of unhealthy relationships.',
              },
              {
                id: 'life-5-b',
                text: 'Setting and maintaining healthy boundaries.',
              },
              {
                id: 'life-5-c',
                text: 'Rebuilding trust in yourself and others.',
              },
            ],
          },
          {
            id: 'life-5-res',
            type: 'resource',
            title: 'Love is Respect - Healthy Relationships',
            url: 'https://www.loveisrespect.org',
          },
        ],
      },
      {
        id: 'life-6',
        title: 'Creating a Safe & Stable Home Environment',
        blocks: [
          {
            id: 'life-6-list',
            type: 'list',
            style: 'bullet',
            items: [
              {
                id: 'life-6-a',
                text: 'Securing housing options for survivors.',
              },
              {
                id: 'life-6-b',
                text: 'Home safety measures and personal security planning.',
              },
              {
                id: 'life-6-c',
                text: 'Navigating child custody and co-parenting concerns.',
              },
            ],
          },
          {
            id: 'life-6-res',
            type: 'resource',
            title: 'Domestic Violence Housing Resources - NNEDV',
            url: 'https://nnedv.org',
          },
        ],
      },
      {
        id: 'life-7',
        title: 'Financial Independence & Stability',
        blocks: [
          {
            id: 'life-7-list',
            type: 'list',
            style: 'bullet',
            items: [
              {
                id: 'life-7-a',
                text: 'Budgeting and financial planning after leaving abuse.',
              },
              {
                id: 'life-7-b',
                text: 'Accessing financial assistance programs and grants.',
              },
              {
                id: 'life-7-c',
                text: 'Steps to rebuilding credit and securing employment.',
              },
            ],
          },
          {
            id: 'life-7-res',
            type: 'resource',
            title: 'Survivor Financial Empowerment - The Allstate Foundation',
            url: 'https://allstatefoundation.org',
          },
        ],
      },
      {
        id: 'life-8',
        title: 'Rebuilding Confidence & Self-Worth',
        blocks: [
          {
            id: 'life-8-list',
            type: 'list',
            style: 'bullet',
            items: [
              {
                id: 'life-8-a',
                text: 'Healing from emotional and psychological abuse.',
              },
              {
                id: 'life-8-b',
                text: 'Daily affirmations and empowerment exercises.',
              },
              {
                id: 'life-8-c',
                text: 'Engaging in hobbies, education, and career growth.',
              },
            ],
          },
          {
            id: 'life-8-res',
            type: 'resource',
            title:
              'The Empowerment Project - National Coalition Against Domestic Violence',
            url: 'https://ncadv.org',
          },
        ],
      },
      {
        id: 'life-9',
        title: 'Legal Considerations & Protective Measures',
        blocks: [
          {
            id: 'life-9-list',
            type: 'list',
            style: 'bullet',
            items: [
              {
                id: 'life-9-a',
                text: 'Understanding restraining orders and protective orders.',
              },
              {
                id: 'life-9-b',
                text: 'Navigating the legal system for custody, divorce, or financial restitution.',
              },
              { id: 'life-9-c', text: 'Knowing your rights as a survivor.' },
            ],
          },
          {
            id: 'life-9-res',
            type: 'resource',
            title: 'Legal Assistance for Survivors - WomensLaw.org',
            url: 'https://www.womenslaw.org',
          },
        ],
      },
      {
        id: 'life-10',
        title: 'Resources for Ongoing Support',
        headingSize: 'large',
        blocks: [
          {
            id: 'life-10-list',
            type: 'list',
            style: 'bullet',
            items: [
              {
                id: 'life-10-a',
                text: 'National and local hotlines for crisis support.',
              },
              { id: 'life-10-b', text: 'Free and low-cost therapy resources.' },
              {
                id: 'life-10-c',
                text: 'Books, podcasts, and online communities for survivors.',
              },
            ],
          },
          {
            id: 'life-10-hotline',
            type: 'resource',
            title: 'National Domestic Violence Hotline',
            url: 'https://www.thehotline.org',
            phone: '800-799-7233', // 1-800-799-SAFE
          },
          {
            id: 'life-10-rainn',
            type: 'resource',
            title: 'RAINN - National Sexual Assault Hotline',
            url: 'https://www.rainn.org',
          },
          {
            id: 'life-10-closing',
            type: 'text',
            content:
              'This guide is meant to empower survivors as they transition into a new, fulfilling chapter of life. With the right support and tools, healing and thriving after abuse is possible.',
          },
        ],
      },
    ],
  },

  {
    id: 'guide-healthy-relationships',
    slug: 'building-healthy-relationships-after-domestic-violence',
    title: 'Building Healthy Relationships After Domestic Violence',
    category: 'Support',
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
    category: 'Support',
    description: 'Component Guide Description here.',
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
