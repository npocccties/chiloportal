import { api } from "..";

import { axiosClient } from "@/lib/axios";
import { CredentialList, SearchFormItem } from "@/types/api/credential";

export const fetchCredentialListApi = async () => {
  const apiPath = api.v1.credential.list;
  const defaultSort = "desk";

  const res = await axiosClient.get<CredentialList>(`${apiPath}?sortOrder=${defaultSort}`);

  return res.data;
};

export const fetchSearchCredentialListApi = async (param: SearchFormItem) => {
  const apiPath = api.v1.credential.list;
  const { badgeName, issuedFrom, issuedTo, sortOrder } = param;

  const res = await axiosClient.get<CredentialList>(
    `${apiPath}?badgeName=${badgeName}&issuedFrom=${issuedFrom}&issuedTo=${issuedTo}&sortOrder=${sortOrder}`,
  );

  return res.data;
};
