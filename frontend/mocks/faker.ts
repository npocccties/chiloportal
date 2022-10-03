import { faker } from "@faker-js/faker";

export const consumer = () => ({
  consumer_id: faker.datatype.number(),
  name: faker.company.name(),
  url: faker.internet.url(),
  email: faker.internet.email(),
});

export const field = () => ({
  field1: [...Array(3)].map(() => ({
    field1_name: faker.animal.bear(),
    field2: [...Array(3)].map(() => ({
      field2_name: faker.animal.bear(),
      field3: [...Array(3)].map(() => ({
        field_id: faker.datatype.number(),
        field3_name: faker.animal.bear(),
      })),
    })),
  })),
});

export const portalCategory = () => ({
  portal_category_id: faker.datatype.number(),
  name: faker.animal.bird(),
  descritpion: faker.lorem.paragraphs(),
  image_url_path: faker.system.filePath(),
  badges_count: faker.datatype.number(),
});

export const wisdomBadges = () => ({
  badges_id: faker.datatype.number(),
  type: "wisdom" as const,
  name: faker.animal.cat(),
  description: faker.lorem.paragraphs(),
  tags: faker.lorem.text(),
  image: faker.system.filePath(),
  image_author: faker.name.fullName(),
  issuer_name: faker.company.name(),
  issuer_url: faker.internet.url(),
  issuer_email: faker.internet.email(),
  degital_badge_class_id: faker.datatype.string(),
  detail: {
    knowledge_badges_list: [...Array(3)].map(faker.datatype.number),
  },
});

export const knowledgeBadges = () => ({
  badges_id: faker.datatype.number(),
  type: "knowledge" as const,
  name: faker.animal.cat(),
  description: faker.lorem.paragraphs(),
  tags: faker.lorem.text(),
  image: faker.system.filePath(),
  image_author: faker.name.fullName(),
  issuer_name: faker.company.name(),
  issuer_url: faker.internet.url(),
  issuer_email: faker.internet.email(),
  degital_badge_class_id: faker.datatype.string(),
  detail: [...Array(3)].map(criteria),
});

export const framework = () => ({
  framework_id: faker.datatype.number(),
  name: faker.animal.cow(),
  description: faker.lorem.paragraphs(),
  supplementary: faker.lorem.paragraphs(),
  url: faker.internet.url(),
});

export const stage = () => ({
  stage_id: faker.datatype.number(),
  name: faker.animal.crocodilia(),
  sub_name: faker.animal.crocodilia(),
  description: faker.lorem.paragraphs(),
});

export const criteria = () => ({
  criteria_id: faker.datatype.number(),
  type: faker.datatype.string(),
  name: faker.animal.cetacean(),
});
