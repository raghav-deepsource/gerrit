/**
 * @license
 * Copyright (C) 2020 The Android Open Source Project
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
import {html} from '@polymer/polymer/lib/utils/html-tag';

export const htmlTemplate = html`
  <style include="gr-ranged-comment-theme">
    /* Workaround for empty style block - see https://github.com/Polymer/tools/issues/408 */
  </style>
  <style include="shared-styles">
    .row {
      color: var(--ranged-comment-chip-text-color);
      display: flex;
      font-family: var(--font-family), Roboto;
      justify-content: flex-end;
      margin: var(--spacing-xs) 0;
    }
    .icon {
      color: var(--ranged-comment-chip-text-color);
      height: 16px;
      width: 16px;
    }
    .chip {
      background-color: var(--ranged-comment-chip-background);
      border-radius: 24px;
      margin: var(--spacing-s);
      padding: var(--spacing-s);
      padding-right: var(--spacing-m);
    }
  </style>
  <div class="row rangeHighlight">
    <div class="chip font-normal">
      <iron-icon class="icon" icon="gr-icons:comment-outline"></iron-icon>
      [[_computeRangeLabel(range)]]
    </div>
  </div>
`;