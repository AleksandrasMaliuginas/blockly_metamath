<script setup lang="ts">

import { onMounted, ref } from "vue";
import { BlockFinder } from "./BlockFinder";
import { Keywords } from "./DatabaseParser/MM";

const props = defineProps({
  blockFinder: {
    type: BlockFinder,
    required: true
  },
});

const blockFinder = props.blockFinder;

const searchStr = ref(blockFinder.searchString);
const mmTypes = ref(blockFinder.mmTypes);
const mmKeywords = ref({
  selected: '',
  options: ['', Keywords.VARIABLE_HYPOTHESIS, Keywords.AXIOMATIC_ASSERTION, Keywords.PROOVABLE_ASSERTION]
});

const setMMTypes = (types: string[]) => {
  mmTypes.value.options = types.map(type => ({
    text: type, value: type
  }));
};

defineExpose({ setMMTypes });

onMounted(async () => {

});

function onSearchUpdate(event: any) {
  blockFinder.updateSearchKey(event.target.value);
}

function onTypeUpdate(event: any) {
  blockFinder.updateSelectedMMType(event.target.value);
}

function onKeywordUpdate() {
  blockFinder.updateSelectedKeyword(mmKeywords.value.selected);
}

function clear() {
  searchStr.value = '';
  blockFinder.updateSearchKey(searchStr.value);
  mmTypes.value.selected = '';
  blockFinder.updateSelectedMMType(mmTypes.value.selected);
}

</script>

<template>
  <div class="inline">

    <section>Block filtering</section>

    <!-- <section>
      <label for="mm-type">Statement type: </label>
      <select id="mm-type" v-model="mmKeywords.selected" @input="onKeywordUpdate">
        <option v-for="option in mmKeywords.options" :value="option">
          {{ option }}
        </option>
      </select>
    </section> -->

    <section>
      <label for="mm-type">Variable type: </label>
      <select id="mm-type" v-model="mmTypes.selected" @input="onTypeUpdate">
        <option v-for="option in mmTypes.options" :value="option.value">
          {{ option.text }}
        </option>
      </select>
    </section>

    <section>
      <label id="search-query">Search query: </label>
      <input id="search-query" v-model="searchStr" @input="onSearchUpdate" placeholder="Variable type" />
    </section>

    <section>
      <button @click="clear">Clear filtering</button>
    </section>

  </div>
</template>

<style scoped>
.inline {
  display: inline-flex;
}

section {
  padding: 0.5em 1em;
}
</style>
