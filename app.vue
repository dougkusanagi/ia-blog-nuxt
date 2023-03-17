<template>
  <div class="bg-base-200 min-h-screen">
    <header>
      <div class="navbar bg-base-100">
        <div class="container mx-auto">
          <RouterLink to="/" class="btn btn-ghost normal-case text-xl"
            >IA Blog
          </RouterLink>
        </div>
      </div>
    </header>

    <div class="flex p-4 gap-4">
      <ul class="menu bg-base-300 w-80 p-2 rounded-box h-fit">
        <li v-for="post in post_list.data" class="mb-2">
          <button
            @click="post_selected = post"
            class="flex bg-base-100 hover:opacity-75 text-left"
            :class="
              post_selected && post_selected.id === post.id
                ? 'bg-indigo-700 text-slate-200'
                : ''
            "
          >
            <span>{{ post.title }}</span>
            <Icon
              name="heroicons:chevron-right-20-solid"
              class="w-8 h-10 ml-auto"
            />
          </button>
        </li>

        <li>
          <label for="create-post-modal" class="btn">
            <Icon
              name="heroicons:plus-circle-20-solid"
              class="w-6 h-6 text-blue-400"
            />
          </label>

          <Teleport to="body">
            <input
              type="checkbox"
              id="create-post-modal"
              class="modal-toggle"
              v-model="show_modal_create_post"
            />
            <label for="create-post-modal" class="modal cursor-pointer">
              <label
                class="modal-box relative w-11/12 max-w-5xl flex gap-2"
                for=""
              >
                <form @submit.prevent="createPost">
                  <input
                    type="text"
                    placeholder="Digite o título do post"
                    class="input input-bordered w-full"
                    v-model="post_title"
                  />
                  <button class="btn w-3/12">Salvar</button>
                </form>
              </label>
            </label>
          </Teleport>
        </li>
      </ul>

      <main v-if="post_selected" class="bg-base-300 flex-1 rounded-2xl">
        <div class="p-4 pb-6">
          <h2 class="text-2xl mb-4 py-4">
            {{ post_selected.title }}
          </h2>

          <div
            v-if="post_selected.postImagines"
            class="questions text-slate-500"
          >
            <div
              v-for="imagine in post_selected.postImagines"
              class="flex gap-4 mb-4 pb-4 border-b-2 border-base-100"
            >
              <div class="w-3/12">
                <p>{{ imagine.question }}</p>
              </div>

              <div class="flex gap-4 w-full">
                <article class="flex-1 lg:prose-xl">
                  {{ imagine.answer }}
                </article>
                <PostImagineDeleteButton
                  :id="imagine.id"
                  @deleted="handlePostImagineDeleted"
                />
              </div>
            </div>
          </div>

          <div class="pb-4">
            <label class="label">
              <span class="label-text">Tema do Artigo</span>
            </label>

            <form class="flex w-full gap-3" @submit.prevent="handle_imagine">
              <div class="form-control w-full">
                <input
                  class="input input-bordered read-only:bg-base-200"
                  placeholder="Sobre o que é o artigo?"
                  type="text"
                  v-model="prompt"
                  :readonly="prompt_is_readonly"
                />
              </div>

              <div class="min-w-[150px]">
                <button
                  class="btn btn-block disabled:bg-base-200 min-h-full"
                  :disabled="btn_imagine_is_disabled"
                >
                  Imaginar
                </button>
                <!-- <button class="btn btn-sm btn-block btn-success mt-4">Salvar</button> -->
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
useHead({ htmlAttrs: { lang: "pt-br" } });

const show_modal_create_post = ref(false);
const post_selected = ref(null);
const post_title = ref("");
const prompt = ref("");
const prompt_is_readonly = ref(false);
const btn_imagine_is_disabled = ref(false);

const { data: post_list } = await useAsyncData("post_list", () =>
  useFetch("/api/post/all")
);

async function handlePostImagineDeleted(event) {
  console.log(post_selected.value.postImagines);
  if (event.ok) {
    post_selected.value.postImagines = post_selected.value.postImagines.filter(
      (postImagine) => postImagine.id !== event._data.id
    );
  }
}

async function createPost() {
  if (post_title.value) {
    const title = post_title.value;
    const resp = await useFetch("/api/post/create", {
      method: "post",
      body: { title },
    });

    post_selected.value = resp.data.value.post;
    post_list.value.data.push(resp.data.value.post);
    show_modal_create_post.value = false;
  }
}

async function handle_imagine() {
  prompt_is_readonly.value = true;
  btn_imagine_is_disabled.value = true;

  const { data: answer } = await useFetch("/api/chatgpt/imagine", {
    method: "post",
    body: { prompt: prompt.value },
  });

  const imagine = {
    question: prompt.value,
    answer: answer,
  };

  post_selected.value.postImagines.push(imagine);
  imagine.postId = post_selected.value.id;

  await useFetch("/api/post-imagine/create", {
    method: "post",
    body: { imagine },
  });

  prompt.value = "";
  prompt_is_readonly.value = false;
  btn_imagine_is_disabled.value = false;
}
</script>
