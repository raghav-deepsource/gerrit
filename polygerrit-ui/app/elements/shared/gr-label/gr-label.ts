/**
 * @license
 * Copyright (C) 2016 The Android Open Source Project
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
 * @fileoverview Consider removing this element as
 * its functionality seems to be duplicated with gr-tooltip and only
 * used in gr-label-info.
 */

import {html, LitElement} from 'lit';
import {customElement} from 'lit/decorators';

declare global {
  interface HTMLElementTagNameMap {
    'gr-label': GrLabel;
  }
}

@customElement('gr-label')
export class GrLabel extends LitElement {
  static override get styles() {
    return [];
  }

  override render() {
    return html` <slot></slot> `;
  }
}
