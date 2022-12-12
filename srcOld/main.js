/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

app.config.globalProperties.$coloursFlyoutCallback = function(workspace) {
  // Returns an array of hex colours, e.g. ['#4286f4', '#ef0447']
  var colourList = ['#4286f4', '#ef0447'];
  var blockList = [];
  for (var i = 0; i < colourList.length; i++) {
    blockList.push({
      'kind': 'block',
      'type': 'colour_picker',
      'fields': {
        'COLOUR': colourList[i]
      }
    });
  }
  return blockList;
};

app.mount("#app");
