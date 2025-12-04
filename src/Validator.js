// src/Validator.js
export class Validator {
  static schemas = {
    person: {
      required: ['id', 'name', 'img', 'links'],
      optional: ['bio', 'role', 'color', 'featured', 'joinDate', 'stats', 'tags', 'verified'],
      types: {
        id: 'string',
        name: 'string',
        bio: 'string',
        role: 'string',
        img: 'string',
        color: 'string',
        featured: 'boolean',
        verified: 'boolean',
        joinDate: 'string',
        links: 'object',
        stats: 'object',
        tags: 'array'
      }
    }
  };

  static validate(data, schema) {
    const errors = [];

    for (const field of schema.required) {
      if (!(field in data)) {
        errors.push(`Campo obrigatório ausente: ${field}`);
      }
    }

    for (const [field, type] of Object.entries(schema.types)) {
      if (field in data) {
        const actualType = Array.isArray(data[field]) ? 'array' : typeof data[field];
        if (actualType !== type) {
          errors.push(`Campo ${field}: esperado ${type}, recebido ${actualType}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static sanitize(data, schema) {
    const sanitized = {};
    const allowed = [...schema.required, ...schema.optional];

    for (const field of allowed) {
      if (field in data) {
        sanitized[field] = data[field];
      }
    }

    return sanitized;
  }
}
