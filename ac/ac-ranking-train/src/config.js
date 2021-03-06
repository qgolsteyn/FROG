// @flow

export const config = {
  type: 'object',
  properties: {
    title: {
      title: 'Prompt',
      type: 'rte'
    },
    guidelines: {
      title: 'Guidelines',
      type: 'rte'
    },
    justify: {
      type: 'boolean',
      title: 'Show textbox where students can justify their ranking'
    },
    mustJustify: {
      type: 'boolean',
      title: 'Require students to fill out the justification before submitting'
    },
    answers: {
      type: 'array',
      title: 'Choices',
      items: { type: 'string' }
    },
    dashboard: {
      type: 'boolean',
      title: 'Show individual data, while re-ranking'
    }
  }
};

export const configUI = {
  mustJustify: { conditional: 'justify' }
};
