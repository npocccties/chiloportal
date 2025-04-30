export const mockAddWallet = {
  walletId: 1,
  orthrosId: "xxxxxx-yyyyyyyy-@niii.co.jp",
  createdAt: new Date(),
};

export const mockWalletId = {
  walletId: 1,
};

export const mockBadgeVcList = [
  {
    badgeVcId: 21,
    badgeName: "地域や保護者との連携 (v1.0)",
    badgeIssuerName: "愛知教育大学",
    badgeIssuedon: "2023-10-27T12:10:39+09:00",
    badgeExpires: null,
    vcDataPayload:
      '{"vc":{"@context":["https://www.w3.org/2018/credentials/v1"],"type":["VerifiableCredential","OpenBadgeV2"],"credentialSubject":{"photo":"iVBORw0KGgoVuYmFkZ2VzL3YyIiwidHlwZSI6IkFzc2VydGlvbiIsImlkIjoiaHR0cHM6Ly9kZXYtbG1zLm9rdS5jY2N0aWVzLm9yZy9iYWRnZXMvYXNzZXJ0aW9uLnBocD9iPWY0YzBlNTBlY2ViN2MyNzgxZTBkMGFiZWE0MDBjYzZlYzQ3ZDMzMzQmb2J2ZXJzaW9uPTIifd3UI68AAAAASUVORK5CYII=","email":"user3@example.com","verificationURL":"https://dev-lms.oku.cccties.org/badges/assertion.php?b=f4c0e50eceb7c2781e0d0abea400cc6ec47d3334&obversion=2","issued":"2023-10-27T12:10:39+09:00"},"credentialStatus":{"id":"urn:uuid:2debee5c-2e7c-47d0-8748-62c0503a3dc8?bit-index=47","type":"RevocationList2021Status","statusListIndex":47,"statusListCredential":"did:web:did.cccties.org?service=IdentityHub&queries=W3sibWV0aG9kIjoiQ29sbGVjdGlvbnNRdWVyeSIsInNjaGVtYSI6Imh0dHBzOi8vdzNpZC5vcmcvdmMtc3RhdHVzLWxpc3QtMjAyMS92MSIsIm9iamVjdElkIjoiMmRlYmVlNWMtMmU3Yy00N2QwLTg3NDgtNjJjMDUwM2EzZGM4In1d"}},"jti":"urn:pic:aab1a493730740b5a1a040edd5e7a896","iss":"did:web:did.cccties.org","sub":"did:ion:EiDAIoNhjIHnuI_GTJqJfV6OWjsm1wCN71QETor_3w9NcA:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJzaWduaW5nS2V5IiwicHVibGljS2V5SndrIjp7ImNydiI6InNlY3AyNTZrMSIsImt0eSI6IkVDIiwieCI6InRqS0RvY05XV29hamZNdTVmdmtUMXhIZWtsS3lmX3JRVkFicXpiUTYxX2MiLCJ5IjoiVmVqdHcydTdpVWZaN0ptZ196bmx6TF8xSVh1Ny1sQWh0LXAxYVBMbjVRMCJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiJdLCJ0eXBlIjoiRWNkc2FTZWNwMjU2azFWZXJpZmljYXRpb25LZXkyMDE5In1dfX1dLCJ1cGRhdGVDb21taXRtZW50IjoiRWlEXzNUOEJkWUJYYVZCazRmQWYxRXdGQVlrUEtvUFVaR1FyeWsxc3duOGNxdyJ9LCJzdWZmaXhEYXRhIjp7ImRlbHRhSGFzaCI6IkVpRFU3N0pyZ0FhU3Zmcld0VDFXZFdvTlhzR2ZISGtfdmU5TU9PX1lYRU9lUWciLCJyZWNvdmVyeUNvbW1pdG1lbnQiOiJFaURfM1Q4QmRZQlhhVkJrNGZBZjFFd0ZBWWtQS29QVVpHUXJ5azFzd244Y3F3In19","iat":1699858326,"exp":1702450326}',
    submissions: [],
  },
];

export const mockSubmissionsAll = {
  totalSubmissionBadges: 0,
  detailSubmissions: [],
};

export const mockBadgeList = {
  badgeList: [
    {
      id: 32,
      name: "test test 3",
      description: "test badge",
      timecreated: 1690332339,
      timemodified: 1690333563,
      usercreated: 2,
      usermodified: 2,
      issuername: "bbbbbbbb",
      issuerurl: "https://{domain}",
      issuercontact: "bbbbbbbbbb@example.net",
      expiredate: 1721919600,
      expireperiod: null,
      type: 1,
      courseid: null,
      message:
        '<p>あなたにバッジ「 %badgename% 」が授与されました!</p> <p>このバッジに関する詳細情報は %badgelink% バッジ情報ページをご覧ください。</p> <p>あなたは「 <a href="https://{domain}/badges/mybadges.php">バッジを管理する</a> 」ページでバッジを管理およびダウンロードできます。</p>',
      messagesubject: "おめでとうございます! あなたはバッジを取得しました!",
      attachment: 1,
      notification: 0,
      nextcron: null,
      status: 3,
      issuedid: 19,
      uniquehash: "8d6d839383cd6e03624b98b70ce4f475f43c2d04",
      dateissued: 1690333563,
      dateexpire: 1721919600,
      visible: 1,
      email: "test@example.com",
      version: "",
      language: "ja",
      imageauthorname: "",
      imageauthoremail: "",
      imageauthorurl: "",
      imagecaption: "",
      badgeurl: "https://{domain}/webservice/pluginfile.php/1/badges/badgeimage/32/f3",
      alignment: [],
      relatedbadges: [],
    },
  ],
};

export const mockBadgeMetaData = {
  recipient: {
    identity: "sha256$b7e1fba9f7d18fcadd371525823a684a69f270b0503c616532ff1f4e7137a563",
    type: "email",
    hashed: true,
    salt: "badges1652333434",
  },
  badge: {
    name: "test test 3",
    description: "test badge",
    image: "data:image/png;base64,iVBORw0KGgoA...ZjMD/A8+RlnxJopqmAAAAAElFTkSuQmCC",
    criteria: {
      id: "https://{domain}/badges/badgeclass.php?id=32",
      narrative:
        "この条件でバッジ授与\n * このバッジは次のロールのユーザによって授与される必要があります:\nマネージャ\n\n",
    },
    issuer: {
      name: "bbbbbbbb",
      url: "https://{domain}",
      email: "bbbbbbbbbb@example.net",
      "@context": "https://w3id.org/openbadges/v2",
      id: "https://{domain}/badges/issuer_json.php?id=32",
      type: "Issuer",
    },
    "@context": "https://w3id.org/openbadges/v2",
    id: "https://{domain}/badges/badge_json.php?id=32",
    type: "BadgeClass",
    version: "",
    "@language": "ja",
  },
  verify: {
    type: "hosted",
    url: "https://{domain}/badges/assertion.php?b=8d6d839383cd6e03624b98b70ce4f475f43c2d04&obversion=2",
  },
  issuedOn: "2023-07-26T10:06:03+09:00",
  evidence: "https://{domain}/badges/badge.php?hash=8d6d839383cd6e03624b98b70ce4f475f43c2d04",
  expires: "2024-07-26T00:00:00+09:00",
  "@context": "https://w3id.org/openbadges/v2",
  type: "Assertion",
  id: "https://{domain}/badges/assertion.php?b=8d6d839383cd6e03624b98b70ce4f475f43c2d04&obversion=2",
};
