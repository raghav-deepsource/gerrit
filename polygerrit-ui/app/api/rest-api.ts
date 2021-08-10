/**
 * @license
 * Copyright (C) 2021 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * rest-api.ts contains all entities from the Gerrit REST API that are also
 * relevant to plugins and gr-diff users. These entities should be exactly what
 * the backend defines and returns and should eventually be generated.
 *
 * Sorting order:
 * - enums in alphabetical order
 * - types and interfaces in alphabetical order
 *   - type checking functions after their corresponding type
 */

/**
 * enums =======================================================================
 */

export enum AccountTag {
  SERVICE_USER = 'SERVICE_USER',
}

/**
 * The authentication type that is configured on the server.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-config.html#auth-info
 */
export enum AuthType {
  OPENID = 'OPENID',
  OPENID_SSO = 'OPENID_SSO',
  OAUTH = 'OAUTH',
  HTTP = 'HTTP',
  HTTP_LDAP = 'HTTP_LDAP',
  CLIENT_SSL_CERT_LDAP = 'CLIENT_SSL_CERT_LDAP',
  LDAP = 'LDAP',
  LDAP_BIND = 'LDAP_BIND',
  CUSTOM_EXTENSION = 'CUSTOM_EXTENSION',
  DEVELOPMENT_BECOME_ANY_ACCOUNT = 'DEVELOPMENT_BECOME_ANY_ACCOUNT',
}

/**
 * @desc Specifies status for a change
 */
export enum ChangeStatus {
  ABANDONED = 'ABANDONED',
  MERGED = 'MERGED',
  NEW = 'NEW',
}

/**
 * The type in ConfigParameterInfo entity.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-projects.html#config-parameter-info
 */
export enum ConfigParameterInfoType {
  // Should be kept in sync with
  // gerrit/java/com/google/gerrit/extensions/api/projects/ProjectConfigEntryType.java.
  STRING = 'STRING',
  INT = 'INT',
  LONG = 'LONG',
  BOOLEAN = 'BOOLEAN',
  LIST = 'LIST',
  ARRAY = 'ARRAY',
}

/**
 * @desc Used for server config of accounts
 */
export enum DefaultDisplayNameConfig {
  USERNAME = 'USERNAME',
  FIRST_NAME = 'FIRST_NAME',
  FULL_NAME = 'FULL_NAME',
}

/**
 * Account fields that are editable
 * https://gerrit-review.googlesource.com/Documentation/rest-api-config.html#auth-info
 */
export enum EditableAccountField {
  FULL_NAME = 'FULL_NAME',
  USER_NAME = 'USER_NAME',
  REGISTER_NEW_EMAIL = 'REGISTER_NEW_EMAIL',
}

/**
 * @desc The status of the file
 */
export enum FileInfoStatus {
  ADDED = 'A',
  DELETED = 'D',
  RENAMED = 'R',
  COPIED = 'C',
  REWRITTEN = 'W',
  // Modifed = 'M', // but API not set it if the file was modified
  UNMODIFIED = 'U', // Not returned by BE, but added by UI for certain files
}

/**
 * @desc The status of the file
 */
export enum GpgKeyInfoStatus {
  BAD = 'BAD',
  OK = 'OK',
  TRUSTED = 'TRUSTED',
}

/**
 * Enum for all http methods used in Gerrit.
 */
export enum HttpMethod {
  HEAD = 'HEAD',
  POST = 'POST',
  GET = 'GET',
  DELETE = 'DELETE',
  PUT = 'PUT',
}

/**
 * Enum for possible configured value in InheritedBooleanInfo.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-projects.html#inherited-boolean-info
 */
export enum InheritedBooleanInfoConfiguredValue {
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  INHERITED = 'INHERITED',
}

/**
 * This setting determines when Gerrit computes if a change is mergeable or not.
 * https://gerrit-review.googlesource.com/Documentation/config-gerrit.html#change.mergeabilityComputationBehavior
 */
export enum MergeabilityComputationBehavior {
  API_REF_UPDATED_AND_CHANGE_REINDEX = 'API_REF_UPDATED_AND_CHANGE_REINDEX',
  REF_UPDATED_AND_CHANGE_REINDEX = 'REF_UPDATED_AND_CHANGE_REINDEX',
  NEVER = 'NEVER',
}

/**
 * @desc The status of fixing the problem
 */
export enum ProblemInfoStatus {
  FIXED = 'FIXED',
  FIX_FAILED = 'FIX_FAILED',
}

/**
 * @desc The state of the projects
 */
export enum ProjectState {
  ACTIVE = 'ACTIVE',
  READ_ONLY = 'READ_ONLY',
  HIDDEN = 'HIDDEN',
}

/**
 * @desc The reviewer state
 */
export enum RequirementStatus {
  OK = 'OK',
  NOT_READY = 'NOT_READY',
  RULE_ERROR = 'RULE_ERROR',
}

/**
 * @desc The reviewer state
 */
export enum ReviewerState {
  REVIEWER = 'REVIEWER',
  CC = 'CC',
  REMOVED = 'REMOVED',
}

/**
 * @desc The patchset kind
 */
export enum RevisionKind {
  REWORK = 'REWORK',
  TRIVIAL_REBASE = 'TRIVIAL_REBASE',
  MERGE_FIRST_PARENT_UPDATE = 'MERGE_FIRST_PARENT_UPDATE',
  NO_CODE_CHANGE = 'NO_CODE_CHANGE',
  NO_CHANGE = 'NO_CHANGE',
}

/**
 * All supported submit types.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-projects.html#submit-type-info
 */
export enum SubmitType {
  MERGE_IF_NECESSARY = 'MERGE_IF_NECESSARY',
  FAST_FORWARD_ONLY = 'FAST_FORWARD_ONLY',
  REBASE_IF_NECESSARY = 'REBASE_IF_NECESSARY',
  REBASE_ALWAYS = 'REBASE_ALWAYS',
  MERGE_ALWAYS = 'MERGE_ALWAYS ',
  CHERRY_PICK = 'CHERRY_PICK',
  INHERIT = 'INHERIT',
}

/**
 * types and interfaces ========================================================
 */

// This is a "meta type", so it comes first and is not sored alphabetically with
// the other types.
export type BrandType<T, BrandName extends string> = T &
  {[__brand in BrandName]: never};

export type AccountId = BrandType<number, '_accountId'>;

/**
 * The AccountInfo entity contains information about an account.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-accounts.html#account-info
 */
export declare interface AccountInfo {
  // Normally _account_id is defined (for known Gerrit users), but users can
  // also be CCed just with their email address. So you have to be prepared that
  // _account_id is undefined, but then email must be set.
  _account_id?: AccountId;
  name?: string;
  display_name?: string;
  // Must be set, if _account_id is undefined.
  email?: EmailAddress;
  secondary_emails?: string[];
  username?: string;
  avatars?: AvatarInfo[];
  _more_accounts?: boolean; // not set if false
  status?: string; // status message of the account
  inactive?: boolean; // not set if false
  tags?: AccountTag[];
}

/**
 * The AccountsConfigInfo entity contains information about Gerrit configuration
 * from the accounts section.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-config.html#accounts-config-info
 */
export interface AccountsConfigInfo {
  visibility: string;
  default_display_name: DefaultDisplayNameConfig;
}

/**
 * The ActionInfo entity describes a REST API call the client can make to
 * manipulate a resource. These are frequently implemented by plugins and may
 * be discovered at runtime.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#action-info
 */
export declare interface ActionInfo {
  method?: HttpMethod; // Most actions use POST, PUT or DELETE to cause state changes.
  label?: string; // Short title to display to a user describing the action
  title?: string; // Longer text to display describing the action
  enabled?: boolean; // not set if false
}

export declare interface ActionNameToActionInfoMap {
  [actionType: string]: ActionInfo | undefined;
  // List of actions explicitly used in code:
  wip?: ActionInfo;
  publishEdit?: ActionInfo;
  rebaseEdit?: ActionInfo;
  deleteEdit?: ActionInfo;
  edit?: ActionInfo;
  stopEdit?: ActionInfo;
  download?: ActionInfo;
  rebase?: ActionInfo;
  cherrypick?: ActionInfo;
  move?: ActionInfo;
  revert?: ActionInfo;
  revert_submission?: ActionInfo;
  abandon?: ActionInfo;
  submit?: ActionInfo;
  topic?: ActionInfo;
  hashtags?: ActionInfo;
  assignee?: ActionInfo;
  ready?: ActionInfo;
  includedIn?: ActionInfo;
}

/**
 * The ApprovalInfo entity contains information about an approval from auser
 * for a label on a change.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#approval-info
 */
export declare interface ApprovalInfo extends AccountInfo {
  value?: number;
  permitted_voting_range?: VotingRangeInfo;
  date?: Timestamp;
  tag?: ReviewInputTag;
  post_submit?: boolean; // not set if false
}

/**
 * The AttentionSetInfo entity contains details of users that are in the attention set.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#attention-set-info
 */
export declare interface AttentionSetInfo {
  account: AccountInfo;
  last_update?: Timestamp;
  reason?: string;
}

/**
 * The AuthInfo entity contains information about the authentication
 * configuration of the Gerrit server.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-config.html#auth-info
 */
export interface AuthInfo {
  auth_type: AuthType; // docs incorrectly names it 'type'
  use_contributor_agreements?: boolean;
  contributor_agreements?: ContributorAgreementInfo[];
  editable_account_fields: EditableAccountField[];
  login_url?: string;
  login_text?: string;
  switch_account_url?: string;
  register_url?: string;
  register_text?: string;
  edit_full_name_url?: string;
  http_password_url?: string;
  git_basic_auth_policy?: string;
}

/**
 * The AvartarInfo entity contains information about an avatar image ofan
 * account.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-accounts.html#avatar-info
 */
export declare interface AvatarInfo {
  url: string;
  height: number;
  width: number;
}

export type BasePatchSetNum = BrandType<'PARENT' | number, '_patchSet'>;
// The refs/heads/ prefix is omitted in Branch name

export type BranchName = BrandType<string, '_branchName'>;

/**
 * The ChangeConfigInfo entity contains information about Gerrit configuration
 * from the change section.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-config.html#change-config-info
 */
export interface ChangeConfigInfo {
  allow_blame?: boolean;
  large_change: number;
  update_delay: number;
  submit_whole_topic?: boolean;
  disable_private_changes?: boolean;
  mergeability_computation_behavior: MergeabilityComputationBehavior;
  enable_assignee: boolean;
}

export type ChangeId = BrandType<string, '_changeId'>;

/**
 * The ChangeInfo entity contains information about a change.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#change-info
 */
export declare interface ChangeInfo {
  id: ChangeInfoId;
  project: RepoName;
  branch: BranchName;
  topic?: TopicName;
  attention_set?: IdToAttentionSetMap;
  assignee?: AccountInfo;
  hashtags?: Hashtag[];
  change_id: ChangeId;
  subject: string;
  status: ChangeStatus;
  created: Timestamp;
  updated: Timestamp;
  submitted?: Timestamp;
  submitter?: AccountInfo;
  starred?: boolean; // not set if false
  stars?: StarLabel[];
  reviewed?: boolean; // not set if false
  submit_type?: SubmitType;
  mergeable?: boolean;
  submittable?: boolean;
  insertions: number; // Number of inserted lines
  deletions: number; // Number of deleted lines
  total_comment_count?: number;
  unresolved_comment_count?: number;
  _number: NumericChangeId;
  owner: AccountInfo;
  actions?: ActionNameToActionInfoMap;
  requirements?: Requirement[];
  labels?: LabelNameToInfoMap;
  permitted_labels?: LabelNameToValueMap;
  removable_reviewers?: AccountInfo[];
  // This is documented as optional, but actually always set.
  reviewers: Reviewers;
  pending_reviewers?: AccountInfo[];
  reviewer_updates?: ReviewerUpdateInfo[];
  messages?: ChangeMessageInfo[];
  current_revision?: CommitId;
  revisions?: {[revisionId: string]: RevisionInfo};
  tracking_ids?: TrackingIdInfo[];
  _more_changes?: boolean; // not set if false
  problems?: ProblemInfo[];
  is_private?: boolean; // not set if false
  work_in_progress?: boolean; // not set if false
  has_review_started?: boolean; // not set if false
  revert_of?: NumericChangeId;
  submission_id?: ChangeSubmissionId;
  cherry_pick_of_change?: NumericChangeId;
  cherry_pick_of_patch_set?: PatchSetNum;
  contains_git_conflicts?: boolean;
  internalHost?: string; // TODO(TS): provide an explanation what is its
  submit_requirements?: SubmitRequirementResultInfo[];
}

// The ID of the change in the format "'<project>~<branch>~<Change-Id>'"
export type ChangeInfoId = BrandType<string, '_changeInfoId'>;

export type ChangeMessageId = BrandType<string, '_changeMessageId'>;

/**
 * The ChangeMessageInfo entity contains information about a message attached
 * to a change.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#change-message-info
 */
export declare interface ChangeMessageInfo {
  id: ChangeMessageId;
  author?: AccountInfo;
  reviewer?: AccountInfo;
  updated_by?: AccountInfo;
  real_author?: AccountInfo;
  date: Timestamp;
  message: string;
  accounts_in_message?: AccountInfo[];
  tag?: ReviewInputTag;
  _revision_number?: PatchSetNum;
}

// This ID is equal to the numeric ID of the change that triggered the
// submission. If the change that triggered the submission also has a topic, it
// will be "<id>-<topic>" of the change that triggered the submission
// The callers must not rely on the format of the submission ID.
export type ChangeSubmissionId = BrandType<
  string | number,
  '_changeSubmissionId'
>;

export type CloneCommandMap = {[name: string]: string};

/**
 * The CommentLinkInfo entity describes acommentlink.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-projects.html#commentlink-info
 */
export interface CommentLinkInfo {
  match: string;
  link?: string;
  enabled?: boolean;
  html?: string;
}

export interface CommentLinks {
  [name: string]: CommentLinkInfo;
}

export type CommitId = BrandType<string, '_commitId'>;

/**
 * The CommitInfo entity contains information about a commit.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#commit-info
 */
export declare interface CommitInfo {
  commit?: CommitId;
  parents: ParentCommitInfo[];
  author: GitPersonInfo;
  committer: GitPersonInfo;
  subject: string;
  message: string;
  web_links?: WebLinkInfo[];
  resolve_conflicts_web_links?: WebLinkInfo[];
}

export interface ConfigArrayParameterInfo extends ConfigParameterInfoBase {
  type: ConfigParameterInfoType.ARRAY;
  values: string[];
}

/**
 * The ConfigInfo entity contains information about the effective
 * project configuration.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-projects.html#config-info
 */
export interface ConfigInfo {
  description?: string;
  use_contributor_agreements?: InheritedBooleanInfo;
  use_content_merge?: InheritedBooleanInfo;
  use_signed_off_by?: InheritedBooleanInfo;
  create_new_change_for_all_not_in_target?: InheritedBooleanInfo;
  require_change_id?: InheritedBooleanInfo;
  enable_signed_push?: InheritedBooleanInfo;
  require_signed_push?: InheritedBooleanInfo;
  reject_implicit_merges?: InheritedBooleanInfo;
  private_by_default: InheritedBooleanInfo;
  work_in_progress_by_default: InheritedBooleanInfo;
  max_object_size_limit: MaxObjectSizeLimitInfo;
  default_submit_type: SubmitTypeInfo;
  submit_type: SubmitType;
  match_author_to_committer_date?: InheritedBooleanInfo;
  state?: ProjectState;
  commentlinks: CommentLinks;
  plugin_config?: PluginNameToPluginParametersMap;
  actions?: {[viewName: string]: ActionInfo};
  reject_empty_commit?: InheritedBooleanInfo;
}

export interface ConfigListParameterInfo extends ConfigParameterInfoBase {
  type: ConfigParameterInfoType.LIST;
  permitted_values?: string[];
}

export type ConfigParameterInfo =
  | ConfigParameterInfoBase
  | ConfigArrayParameterInfo
  | ConfigListParameterInfo;

/**
 * The ConfigParameterInfo entity describes a project configurationparameter.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-projects.html#config-parameter-info
 */
export interface ConfigParameterInfoBase {
  display_name?: string;
  description?: string;
  warning?: string;
  type: ConfigParameterInfoType;
  value?: string;
  values?: string[];
  editable?: boolean;
  permitted_values?: string[];
  inheritable?: boolean;
  configured_value?: string;
  inherited_value?: string;
}

// https://gerrit-review.googlesource.com/Documentation/rest-api-accounts.html#contributor-agreement-info
export interface ContributorAgreementInfo {
  name: string;
  description: string;
  url: string;
  auto_verify_group?: GroupInfo;
}

/**
 * LabelInfo when DETAILED_LABELS are requested.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#_fields_set_by_code_detailed_labels_code
 */
export declare interface DetailedLabelInfo extends LabelCommonInfo {
  // This is not set when the change has no reviewers.
  all?: ApprovalInfo[];
  // Docs claim that 'values' is optional, but it is actually always set.
  values?: LabelValueToDescriptionMap; // A map of all values that are allowed for this label
  default_value?: number;
}

export function isDetailedLabelInfo(
  label: LabelInfo
): label is DetailedLabelInfo | (QuickLabelInfo & DetailedLabelInfo) {
  return !!(label as DetailedLabelInfo).values;
}

/**
 * The DownloadInfo entity contains information about supported download
 * options.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-config.html#download-info
 */
export interface DownloadInfo {
  schemes: SchemesInfoMap;
  archives: string[];
}

/**
 * The DownloadSchemeInfo entity contains information about a supported download
 * scheme and its commands.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-config.html
 */
export interface DownloadSchemeInfo {
  url: string;
  is_auth_required: boolean;
  is_auth_supported: boolean;
  commands: string;
  clone_commands: CloneCommandMap;
}

export type EmailAddress = BrandType<string, '_emailAddress'>;

/**
 * The FetchInfo entity contains information about how to fetch a patchset via
 * a certain protocol.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#fetch-info
 */
export declare interface FetchInfo {
  url: string;
  ref: string;
  commands?: {[commandName: string]: string};
}

/**
 * The FileInfo entity contains information about a file in a patch set.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#file-info
 */
export declare interface FileInfo {
  status?: FileInfoStatus;
  binary?: boolean; // not set if false
  old_path?: string;
  lines_inserted?: number;
  lines_deleted?: number;
  size_delta: number; // in bytes
  size: number; // in bytes
}

/**
 * The GerritInfo entity contains information about Gerrit configuration from
 * the gerrit section.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-config.html#gerrit-info
 */
export interface GerritInfo {
  all_projects: string; // Doc contains incorrect name
  all_users: string; // Doc contains incorrect name
  doc_search: boolean;
  doc_url?: string;
  edit_gpg_keys?: boolean;
  report_bug_url?: string;
  // The following property is missed in doc
  primary_weblink_name?: string;
}

export type GitRef = BrandType<string, '_gitRef'>;
// The 40-char (plus spaces) hex GPG key fingerprint

export type GpgKeyFingerprint = BrandType<string, '_gpgKeyFingerprint'>;
// The 8-char hex GPG key ID.

export type GpgKeyId = BrandType<string, '_gpgKeyId'>;

/**
 * The GpgKeyInfo entity contains information about a GPG public key.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-accounts.html#gpg-key-info
 */
export declare interface GpgKeyInfo {
  id?: GpgKeyId;
  fingerprint?: GpgKeyFingerprint;
  user_ids?: OpenPgpUserIds[];
  key?: string; // ASCII armored public key material
  status?: GpgKeyInfoStatus;
  problems?: string[];
}

/**
 * The GitPersonInfo entity contains information about theauthor/committer of
 * a commit.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#git-person-info
 */
export declare interface GitPersonInfo {
  name: string;
  email: EmailAddress;
  date: Timestamp;
  tz: TimezoneOffset;
}

export type GroupId = BrandType<string, '_groupId'>;

/**
 * The GroupInfo entity contains information about a group. This can be a
 * Gerrit internal group, or an external group that is known to Gerrit.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-groups.html#group-info
 */
export interface GroupInfo {
  id: GroupId;
  name?: GroupName;
  url?: string;
  options?: GroupOptionsInfo;
  description?: string;
  group_id?: string;
  owner?: string;
  owner_id?: string;
  created_on?: string;
  _more_groups?: boolean;
  members?: AccountInfo[];
  includes?: GroupInfo[];
}

export type GroupName = BrandType<string, '_groupName'>;

/**
 * Options of the group.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-groups.html
 */
export interface GroupOptionsInfo {
  visible_to_all: boolean;
}

export type Hashtag = BrandType<string, '_hashtag'>;

export type IdToAttentionSetMap = {[accountId: string]: AttentionSetInfo};

/**
 * A boolean value that can also be inherited.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-projects.html#inherited-boolean-info
 */
export interface InheritedBooleanInfo {
  value: boolean;
  configured_value: InheritedBooleanInfoConfiguredValue;
  inherited_value?: boolean;
}

export declare interface LabelCommonInfo {
  optional?: boolean; // not set if false
}

export type LabelNameToInfoMap = {[labelName: string]: LabelInfo};

// {Verified: ["-1", " 0", "+1"]}
export type LabelNameToValueMap = {[labelName: string]: string[]};

/**
 * The LabelInfo entity contains information about a label on a change, always
 * corresponding to the current patch set.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#label-info
 */
export type LabelInfo =
  | QuickLabelInfo
  | DetailedLabelInfo
  | (QuickLabelInfo & DetailedLabelInfo);

// The map maps the values (“-2”, “-1”, " `0`", “+1”, “+2”) to the value descriptions.
export type LabelValueToDescriptionMap = {[labelValue: string]: string};

/**
 * The MaxObjectSizeLimitInfo entity contains information about the max object
 * size limit of a project.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-projects.html#max-object-size-limit-info
 */
export interface MaxObjectSizeLimitInfo {
  value?: string;
  configured_value?: string;
  summary?: string;
}

export type NumericChangeId = BrandType<number, '_numericChangeId'>;
// OpenPGP User IDs (https://tools.ietf.org/html/rfc4880#section-5.11).

export type OpenPgpUserIds = BrandType<string, '_openPgpUserIds'>;

/**
 * The parent commits of this commit as a list of CommitInfo entities.
 * In each parent only the commit and subject fields are populated.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#commit-info
 */
export declare interface ParentCommitInfo {
  commit: CommitId;
  subject: string;
}

export type PatchSetNum = BrandType<'PARENT' | 'edit' | number, '_patchSet'>;

/**
 * The PluginConfigInfo entity contains information about Gerrit extensions by
 * plugins.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-config.html#plugin-config-info
 */
export interface PluginConfigInfo {
  has_avatars: boolean;
  // Exists in Java class, but not mentioned in docs.
  js_resource_paths: string[];
}

/**
 * Plugin configuration values as map which maps the plugin name to a map of parameter names to values
 * https://gerrit-review.googlesource.com/Documentation/rest-api-projects.html#config-input
 */
export type PluginNameToPluginParametersMap = {
  [pluginName: string]: PluginParameterToConfigParameterInfoMap;
};

export type PluginParameterToConfigParameterInfoMap = {
  [parameterName: string]: ConfigParameterInfo;
};

/**
 * The ProblemInfo entity contains a description of a potential consistency
 * problem with a change. These are not related to the code review process,
 * but rather indicate some inconsistency in Gerrit’s database or repository
 * metadata related to the enclosing change.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#problem-info
 */
export declare interface ProblemInfo {
  message: string;
  status?: ProblemInfoStatus; // Only set if a fix was attempted
  outcome?: string;
}

/**
 * The PushCertificateInfo entity contains information about a pushcertificate
 * provided when the user pushed for review with git push
 * --signed HEAD:refs/for/<branch>. Only used when signed push is
 * enabled on the server.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#push-certificate-info
 */
export declare interface PushCertificateInfo {
  certificate: string;
  key: GpgKeyInfo;
}

export declare interface QuickLabelInfo extends LabelCommonInfo {
  approved?: AccountInfo;
  rejected?: AccountInfo;
  recommended?: AccountInfo;
  disliked?: AccountInfo;
  blocking?: boolean; // not set if false
  value?: number; // The voting value of the user who recommended/disliked this label on the change if it is not “+1”/“-1”.
  default_value?: number;
}

export function isQuickLabelInfo(
  l: LabelInfo
): l is QuickLabelInfo | (QuickLabelInfo & DetailedLabelInfo) {
  const quickLabelInfo = l as QuickLabelInfo;
  return (
    quickLabelInfo.approved !== undefined ||
    quickLabelInfo.rejected !== undefined ||
    quickLabelInfo.recommended !== undefined ||
    quickLabelInfo.disliked !== undefined ||
    quickLabelInfo.blocking !== undefined ||
    quickLabelInfo.blocking !== undefined ||
    quickLabelInfo.value !== undefined
  );
}

/**
 * The ReceiveInfo entity contains information about the configuration of
 * git-receive-pack behavior on the server.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-config.html#receive-info
 */
export interface ReceiveInfo {
  enable_signed_push?: string;
}

export type RepoName = BrandType<string, '_repoName'>;

/**
 * The Requirement entity contains information about a requirement relative to
 * a change.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#requirement
 */
export declare interface Requirement {
  status: RequirementStatus;
  fallbackText: string; // A human readable reason
  type: RequirementType;
}

export type RequirementType = BrandType<string, '_requirementType'>;

/**
 * The reviewers as a map that maps a reviewer state to a list of AccountInfo
 * entities. Possible reviewer states are REVIEWER, CC and REMOVED.
 * REVIEWER: Users with at least one non-zero vote on the change.
 * CC: Users that were added to the change, but have not voted.
 * REMOVED: Users that were previously reviewers on the change, but have been removed.
 */
export type Reviewers = Partial<Record<ReviewerState, AccountInfo[]>>;

/**
 * The ReviewerUpdateInfo entity contains information about updates to change’s
 * reviewers set.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#review-update-info
 */
export declare interface ReviewerUpdateInfo {
  updated: Timestamp;
  updated_by: AccountInfo;
  reviewer: AccountInfo;
  state: ReviewerState;
}

export type ReviewInputTag = BrandType<string, '_reviewInputTag'>;

/**
 * The RevisionInfo entity contains information about a patch set.Not all
 * fields are returned by default.  Additional fields can be obtained by
 * adding o parameters as described in Query Changes.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#revision-info
 * basePatchNum is present in case RevisionInfo is of type 'edit'
 */
export declare interface RevisionInfo {
  kind: RevisionKind;
  _number: PatchSetNum;
  created: Timestamp;
  uploader: AccountInfo;
  ref: GitRef;
  fetch?: {[protocol: string]: FetchInfo};
  commit?: CommitInfo;
  files?: {[filename: string]: FileInfo};
  actions?: ActionNameToActionInfoMap;
  reviewed?: boolean;
  commit_with_footers?: boolean;
  push_certificate?: PushCertificateInfo;
  description?: string;
  basePatchNum?: BasePatchSetNum;
}

export type SchemesInfoMap = {[name: string]: DownloadSchemeInfo};

/**
 * The ServerInfo entity contains information about the configuration of the
 * Gerrit server.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-config.html#server-info
 */
export interface ServerInfo {
  accounts: AccountsConfigInfo;
  auth: AuthInfo;
  change: ChangeConfigInfo;
  download: DownloadInfo;
  gerrit: GerritInfo;
  // docs mentions index property, but it doesn't exists in Java class
  // index: IndexConfigInfo;
  note_db_enabled?: boolean;
  plugin: PluginConfigInfo;
  receive?: ReceiveInfo;
  sshd?: SshdInfo;
  suggest: SuggestInfo;
  user: UserConfigInfo;
  default_theme?: string;
}

/**
 * The SshdInfo entity contains information about Gerrit configuration from the sshd section.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-config.html#sshd-info
 * This entity doesn’t contain any data, but the presence of this (empty) entity
 * in the ServerInfo entity means that SSHD is enabled on the server.
 */
export type SshdInfo = {};

export type StarLabel = BrandType<string, '_startLabel'>;
// Timestamps are given in UTC and have the format
// "'yyyy-mm-dd hh:mm:ss.fffffffff'"
// where "'ffffffffff'" represents nanoseconds.

/**
 * Information about the default submittype of a project, taking into account
 * project inheritance.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-projects.html#submit-type-info
 */
export interface SubmitTypeInfo {
  value: Exclude<SubmitType, SubmitType.INHERIT>;
  configured_value: SubmitType;
  inherited_value: Exclude<SubmitType, SubmitType.INHERIT>;
}

/**
 * The SuggestInfo entity contains information about Gerritconfiguration from
 * the suggest section.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-config.html#suggest-info
 */
export interface SuggestInfo {
  from: number;
}

export type Timestamp = BrandType<string, '_timestamp'>;
// The timezone offset from UTC in minutes

export type TimezoneOffset = BrandType<number, '_timezoneOffset'>;

export type TopicName = BrandType<string, '_topicName'>;

export type TrackingId = BrandType<string, '_trackingId'>;

/**
 * The TrackingIdInfo entity describes a reference to an external tracking
 * system.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#tracking-id-info
 */
export declare interface TrackingIdInfo {
  system: string;
  id: TrackingId;
}

/**
 * The UserConfigInfo entity contains information about Gerrit configuration
 * from the user section.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-config.html#user-config-info
 */
export interface UserConfigInfo {
  anonymous_coward_name: string;
}

/**
 * The VotingRangeInfo entity describes the continuous voting range from minto
 * max values.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#voting-range-info
 */
export declare interface VotingRangeInfo {
  min: number;
  max: number;
}

/**
 * The WebLinkInfo entity describes a link to an external site.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#web-link-info
 */
export declare interface WebLinkInfo {
  /** The link name. */
  name: string;
  /** The link URL. */
  url: string;
  /** URL to the icon of the link. */
  image_url: string;
}

/**
 * The SubmitRequirementResultInfo describes the result of evaluating
 * a submit requirement on a change.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#submit-requirement-result-info
 */
export declare interface SubmitRequirementResultInfo {
  name: string;
  description?: string;
  status: SubmitRequirementStatus;
  applicability_expression_result?: SubmitRequirementExpressionInfo;
  submittability_expression_result: SubmitRequirementExpressionInfo;
  override_expression_result?: SubmitRequirementExpressionInfo;
}

/**
 * The SubmitRequirementExpressionInfo describes the result of evaluating
 * a single submit requirement expression, for example label:code-review=+2.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#submit-requirement-expression-info
 */
export declare interface SubmitRequirementExpressionInfo {
  expression: string;
  fulfilled: boolean;
  passing_atoms: string;
  failing_atoms: string;
}

/**
 * Status describing the result of evaluating the submit requirement.
 * https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#submit-requirement-result-info
 */
export enum SubmitRequirementStatus {
  SATISFIED = 'SATISFIED',
  UNSATISFIED = 'UNSATISFIED',
  OVERRIDDEN = 'OVERRIDDEN',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}