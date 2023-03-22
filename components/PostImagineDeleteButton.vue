<template>
  <button
    @click="deletePostImagine(id)"
    class="btn btn-error btn-outline btn-sm w-8 h-8"
    :disabled="pending"
  >
    <span :class="pending ? 'hidden' : ''"
      ><Icon name="heroicons:trash-20-solid" class="w-4 h-4"
    /></span>

    <span :class="pending ? '' : 'hidden'"
      ><Icon name="heroicons:arrow-path" class="w-4 h-4 animate-spin"
    /></span>

    <!-- <Icon
      name="heroicons:arrow-path-20-solid"
      class="w-5 h-5"
      :class="!pending ? 'hidden' : ''"
    /> -->
  </button>
</template>

<script setup>
const emit = defineEmits(["deleted"]);
const pending = ref(false);

const props = defineProps({ id: Number });

async function deletePostImagine() {
  pending.value = true;

  await useFetch("/api/post-imagine/delete", {
    method: "post",
    body: { id: props.id },
    onRequest({ request, options }) {
      console.log("[onRequest]", { request, options });
    },
    onResponseError({ request, options, error }) {
      console.log("[onResponseError]", { request, options, error });
    },
    onResponse({ request, response, options }) {
      console.log("[onResponse]", { request, options, response });

      emit("deleted", response);

      if (response.ok) alert("Registro deletado");
    },
  });

  pending.value = false;
}
</script>
