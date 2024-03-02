import { fakerJA as faker } from "@faker-js/faker";
import {
  Consumer,
  Issuer,
  FieldDetail,
  PortalCategory,
  BadgeDetail1,
  Framework,
  Stage,
  Criteria,
  ConsumerGoal,
  ConsumerBadge,
} from "api/@types";

export const consumer = (): Consumer => ({
  consumer_id: faker.number.int(),
  name: faker.company.name(),
  url: faker.internet.url(),
  email: faker.internet.email(),
});

export const issuer = (): Issuer => ({
  issuer_id: faker.number.int(),
  name: faker.company.name(),
  url: faker.internet.url(),
  email: faker.internet.email(),
});

export const field = (): FieldDetail => ({
  field1: [...Array(3)].map(() => ({
    field1_name: faker.animal.bear(),
    field2: [...Array(3)].map(() => ({
      field2_name: faker.animal.bear(),
      field3: [...Array(3)].map(() => ({
        field_id: faker.number.int(),
        field3_name: faker.animal.bear(),
        wisdom_badges: [...Array(3)].map(faker.number.int),
      })),
    })),
  })),
});

export const portalCategory = (): PortalCategory => ({
  portal_category_id: faker.number.int(),
  name: faker.animal.bird(),
  description: faker.lorem.paragraph(),
  image_url_path: "mock-portal-category.png",
  badges_count: faker.number.int(),
});

export const wisdomBadges = (): BadgeDetail1 => ({
  badges_id: faker.number.int(),
  type: "wisdom" as const,
  name: faker.animal.cat(),
  description: faker.lorem.paragraph(),
  tags: faker.lorem.text(),
  image: "mock-wisdom-badge.png",
  image_author: faker.person.fullName(),
  issuer_name: faker.company.name(),
  issuer_url: faker.internet.url(),
  issuer_email: faker.internet.email(),
  portal_category_id: faker.number.int(),
  portal_category_name: faker.animal.bird(),
  portal_category_description: faker.lorem.paragraph(),
  portal_category_image_url_path: "mock-portal-category.png",
  digital_badge_class_id: faker.string.sample(),
  alignments_targetname: faker.commerce.department(),
  alignments_targeturl: faker.internet.url(),
  detail: {
    knowledge_badges_list: [...Array(3)].map(faker.number.int),
  },
});

export const knowledgeBadges = (): BadgeDetail1 => ({
  badges_id: faker.number.int(),
  type: "knowledge" as const,
  name: faker.animal.cat(),
  description: faker.lorem.paragraph(),
  tags: faker.lorem.text(),
  image: "mock-knowledge-badge.png",
  image_author: faker.person.fullName(),
  issuer_name: faker.company.name(),
  issuer_url: faker.internet.url(),
  issuer_email: faker.internet.email(),
  portal_category_id: faker.number.int(),
  portal_category_name: faker.animal.bird(),
  portal_category_description: faker.lorem.paragraph(),
  portal_category_image_url_path: "mock-portal-category.png",
  digital_badge_class_id: faker.string.sample(),
  alignments_targetname: faker.commerce.department(),
  alignments_targeturl: faker.internet.url(),
  detail: [...Array(3)].map(criteria),
});

export const framework = (): Framework => ({
  framework_id: faker.number.int(),
  name: faker.animal.cow(),
  description: faker.lorem.paragraph(),
  supplementary: faker.lorem.paragraph(),
  url: faker.internet.url(),
});

export const stage = (): Stage => ({
  stage_id: faker.number.int(),
  name: faker.animal.crocodilia(),
  sub_name: Math.round(Math.random()) ? faker.animal.crocodilia() : "",
  description: faker.lorem.paragraph(),
});

export const criteria = (): Criteria => ({
  criteria_id: faker.number.int(),
  type: ["ビデオ", "小テスト", "アンケート", "レッスン"][
    Math.floor(Math.random() * 4)
  ],
  name: "1." + faker.animal.cetacean(),
});

export const consumerGoal = (): ConsumerGoal => ({
  consumer_name: faker.company.name(),
  consumer_id: faker.number.int(),
  framework_id: faker.number.int(),
  framework_name: faker.animal.cow(),
  stage_id: faker.number.int(),
  stage_name: faker.animal.crocodilia(),
  field1_name: faker.animal.bear(),
});

export const consumerBadge = (): ConsumerBadge => ({
  consumer_name: faker.company.name(),
  consumer_id: faker.number.int(),
  framework_id: faker.number.int(),
  framework_name: faker.animal.cow(),
  stage_id: faker.number.int(),
  stage_name: faker.animal.crocodilia(),
  field1_name: faker.animal.bear(),
  digital_badge_class_id: faker.string.sample(),
  wisdom_badges_id: faker.number.int(),
  wisdom_badges_name: faker.animal.cat(),
  wisdom_badges_description: faker.lorem.paragraph(),
  knowledge_badges_count: faker.number.int(),
});

export const paginatedWisdomBadges = (
  pageNumber?: number,
): {
  badges: BadgeDetail1[];
  total_count: number;
  start: number;
  end: number;
} => {
  const perPage = 30;
  const totalCount = 3000;
  return {
    badges: [...Array(pageNumber ? perPage : totalCount)].map(wisdomBadges),
    total_count: totalCount,
    start: perPage * ((pageNumber ?? 1) - 1) + 1,
    end: pageNumber ? Math.min(perPage * pageNumber, totalCount) : totalCount,
  };
};
