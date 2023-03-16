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
      <ul class="menu bg-base-100 w-56 p-2 rounded-box">
        <li v-for="post in post_list.data" class="mb-2">
          <button
            @click="post_selected = post"
            class="flex bg-base-300 text-left"
          >
            <span>{{ post.title }}</span>
            <Icon
              name="heroicons:chevron-right-solid"
              class="w-10 h-10 text-slate-400"
            />
          </button>
        </li>

        <li>
          <!-- The button to open modal -->
          <label for="create-post-modal" class="btn">
            <Icon
              name="heroicons:plus-circle-20-solid"
              class="w-6 h-6 text-blue-400"
            />
          </label>

          <Teleport to="body">
            <!-- Put this part before </body> tag -->
            <input
              type="checkbox"
              id="create-post-modal"
              class="modal-toggle"
              v-model="show_create_post_modal"
            />
            <label for="create-post-modal" class="modal cursor-pointer">
              <label
                class="modal-box relative w-11/12 max-w-5xl flex gap-2"
                for=""
              >
                <input
                  type="text"
                  placeholder="Digite o título do post"
                  class="input input-bordered w-full"
                  v-model="post_title"
                />
                <button class="btn w-3/12" @click="createPost">Salvar</button>
              </label>
            </label>
          </Teleport>
        </li>
      </ul>

      <main v-if="post_selected" class="bg-base-100 flex-1 rounded-2xl">
        <div class="p-4 pb-6">
          <h2 class="text-2xl mb-4 py-4">
            {{ post_selected.title }}
          </h2>

          <div
            v-if="post_selected.postImagine"
            class="questions text-slate-500"
          >
            <div
              v-for="imagine in post_selected.postImagine"
              class="flex gap-4 mb-4 pb-4 border-b-2 border-base-100"
            >
              <div class="w-3/12">
                <p>{{ imagine.question }}</p>
              </div>

              <div class="flex gap-4 w-full">
                <p>{{ imagine.answer }}</p>

                <button class="btn btn-error">
                  <Icon name="heroicons:trash-20-solid" />
                  Apagar
                </button>
              </div>
            </div>
          </div>

          <div class="pb-4 mb-4">
            <label class="label">
              <span class="label-text">Tema do Artigo</span>
            </label>

            <div class="flex w-full items-end gap-3">
              <div class="form-control w-full">
                <textarea
                  class="w-full textarea textarea-bordered h-24"
                  placeholder="Sobre o que é o artigo?"
                  v-model="prompt"
                ></textarea>
              </div>

              <div class="min-w-[150px]">
                <button class="btn btn-block mb-4" @click="imagine">
                  Imaginar
                </button>
                <button class="btn btn-sm btn-block btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
useHead({ htmlAttrs: { lang: "pt-br" } });
const post_title = ref("");
const prompt = ref("");
const post_selected = ref(null);
const show_create_post_modal = ref(false);

const { data: post_list } = await useAsyncData("post_list", () =>
  useFetch("/api/post/all")
);

async function createPost() {
  if (post_title.value) {
    const title = post_title.value;
    const resp = await useFetch("/api/post/create", {
      method: "post",
      body: { title },
    });

    console.log(post_list.value.data);

    post_selected.value = resp.data.value.post;
    post_list.value.data.push(resp.data.value.post);
    show_create_post_modal.value = false;
  }
}

async function imagine() {
  imagine_response.value = await useFetch("/api/chatgpt", {
    method: "post",
    body: { prompt },
  });

  console.log(imagine_response.value);
}
</script>
