export class BadgeInfo {
  private _badgeInfo: IfBadgeInfo;

  constructor(ifbadgeInfo: IfBadgeInfo) {
    this._badgeInfo = ifbadgeInfo;
  }

  get badgeName() {
    return this._badgeInfo.name;
  }
}

export interface IfBadgeInfo {
  id: number;
  name: string;
  description: string;
  timecreated: number;
  issuername: string;
  issuerurl: string;
  expiredate?: number;
  message: string;
  uniquehash: string;
  dateissued: number;
  email: string;
  badgeurl: string;
  vcConverted?: boolean;
}

export type WisdomBadgeInfo = {
  name: string;
  description: string;
  image: Image;
  criteria: Criteria;
  issuer: Issuer;
  "@context": string;
  id: string;
  type: string;
  version: string;
  "@language": string;
  alignments: Alignment[];
};

export type KnowledgeBadgeInfo = {
  name: string;
  description: string;
  image: Image;
  criteria: Criteria;
  issuer: Issuer;
  "@context": string;
  id: string;
};

export type Alignment = {
  targetName: string;
  targetUrl: string;
};

type Criteria = {
  id: string;
  narrative: string;
};

type Image = {
  id: string;
  author: string;
};

export type Issuer = {
  name: string;
  url: string;
  email: string;
  "@context": string;
  id: string;
  type: string;
};

export interface IfCourseInfo {
  id: number;           // コースID
  fullname: string;     // コース名  
  shortname: string;    // 省略名
  displayname: string;
  accessedusercount: number;
  idnumber: string;
  visible: number;
  hidden: boolean;
  summary: string;
  startdate: number;    // 開始日
  enddate?: number;     // 終了日
  lastaccess?: number;  // コースへの最終アクセス日時
  category?: number;    // カテゴリID
  progress?: number;    // 進捗
  completed?: number;
  dateexpire?: number;
}

export interface IfUserInfo {
  id: number;           // ユーザID
  username : string;    // ユーザ名
  email: string;
}

export interface IfUserBadgeStatusList {
  lms_badge_count: number;
  lms_badge_list: IfUserBadgeStatus[];
  badge_detail_base_url: string;
  error_code: string;
}

export interface IfUserBadgeStatus {
  enrolled: boolean;
  issued: boolean;
  imported: boolean;
  submitted: boolean;
  accessed_at: string;
  course_start_date: string;
  course_end_date: string;
  issued_at: string;
  imported_at: string;
  badge_expired_at: string;
  badge_vc_id: number;
  lms_id: number;
  lms_name: string;
  lms_url: string;
  course_id: number;
  course_name: string;
  course_description: string;
  badge_class_id: string,
  badge_json: string;
  badge_name: string;
  badge_issuer_name: string;
}

export type UserBadgeStatus = IfUserBadgeStatus;

export interface IfPortalBadgeDetail2 {
  badges_id: number;
}

export interface IfPortalBadgeDetail1 {
  badges_id: number;
  type: "wisdom" | "knowledge";
  name: string;
  description: string;
  tags: string;
  image: string;
  image_author: string;
  issuer_name: string;
  issuer_url: string;
  issuer_email: string;
  portal_category_id: number;
  portal_category_name: string;
  portal_category_description: string;
  portal_category_image_url_path: string;
  digital_badge_class_id: string;
  alignments_targetname: string;
  alignments_targeturl: string;
  detail: Wisdom;
}

interface Wisdom {
  knowledge_badges_list: number[];
}