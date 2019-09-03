<template>
  <div id="app">
    <header class="header-nav">
      <h1>EasyChat</h1>
      <!-- ログイン時にはフォームとログアウトボタンを表示 -->
      <div v-if="user.uid" key="login">
        <img
          :src="user.photoURL"
          width="40"
          height="40"
          class="profile_image"
        />
        {{ user.displayName }}
        <button
          type="button"
          @click="Logout"
          class="btn btn-danger float-right"
        >
          ログアウト
        </button>
      </div>
      <!-- 未ログイン時にはログインボタンを表示 -->
      <div v-else key="logout">
        <button type="button" @click="LoginViaGoogle" class="btn btn-dark">
          Googleアカウントで始める
        </button>
      </div>
    </header>
    <!--　Firebase から取得したリストを描画　-->
    <div v-if="user.uid" class="message_list">
      <transition-group name="chat" tag="div" class="content">
        <section v-for="list in chat" :key="list.key" class="chat">
          <div class="chat-image">
            <img :src="list.image" width="40" height="40" />
          </div>
          <div class="chat-detail">
            <div class="chat-name">FROM {{ list.name }}</div>
            <div class="chat-message">
              <nl2br tag="div" :text="list.message" />
            </div>
            <span v-if="user.displayName === list.name">
              <button
                class="btn btn-outline-danger btn-sm"
                type="button"
                @click="MessageDelete(list.key)"
              >
                削除
              </button>
            </span>
          </div>

        </section>
      </transition-group>
      <!-- 入力フォーム -->
      <form action="" @submit.prevent="Send" class="form">
        <textarea
          class="form-control"
          v-model="input"
          :disabled="!user.uid"
          @keydown.enter.exact.prevent="Send"
        ></textarea>
        <button
          type="submit"
          :disabled="!user.uid"
          class="send-button btn btn-primary"
        >
          投稿する
        </button>
      </form>
    </div>

    <!-- トップページ（非ログイン時） -->
    <div v-else class="top-page-no-login">
      <header class="masthead text-white text-center">
        <div class="overlay"></div>
        <div class="container"></div>
      </header>
      <div class="expl bg-light">
        <h2 class="text-center">Welcome to EasyChat!</h2>
      </div>
    </div>
  </div>
</template>

<script>
    import firebase from "firebase";
    import Nl2br from "vue-nl2br";
    export default {
        components: { Nl2br },
        data() {
            return {
                user: {}, // ユーザー情報
                chat: [], // 取得したメッセージを入れる配列
                input: "" // 入力したメッセージ
            };
        },
        created() {
            firebase.auth().onAuthStateChanged(user => {
                this.user = user ? user : {};
                const ref_message = firebase.database().ref("message");
                if (user) {
                    this.chat = [];

                    ref_message.limitToLast(20).on("child_added", this.childAdded);
                } else {
                    ref_message.limitToLast(20).off("child_added", this.childAdded);
                }
            });
        },
        methods: {
            // ログイン処理
            LoginViaGoogle() {
                const provider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithPopup(provider);
            },
            // ログアウト処理
            Logout() {
                firebase.auth().signOut();
            },
            scrollBottom() {
                this.$nextTick(() => {
                    window.scrollTo(0, document.body.clientHeight);
                });
            },
            childAdded(snap) {
                const message = snap.val();
                this.chat.push({
                    key: snap.key,
                    name: message.name,
                    image: message.image,
                    message: message.message
                });
                this.scrollBottom();
            },

            Send() {
                if (this.user.uid && this.input.length) {
                    firebase
                        .database()
                        .ref("message")
                        .push(
                            {
                                message: this.input,
                                name: this.user.displayName,
                                image: this.user.photoURL
                            },
                            () => {
                                this.input = "";
                            }
                        );
                }
            },
            //削除処理
            MessageDelete: function(key) {
                this.database = firebase.database();
                //データベースから削除
                this.database
                    .ref("message")
                    .child(key)
                    .remove(err => {
                        if (err) throw err;
                    }).then(function () {
                    alert('削除しました')
                })

                function getIndex(value, arr, prop) {
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i][prop] === value) {
                            return i;
                        }
                    }
                    return -1;
                }
                //削除されたデータのChat連想配列における、インデックスを習得
                var i = getIndex(key, this.chat, "key");
                //削除されたデータをChat連想配列からも削除
                this.chat.splice(i, 1);
            }
        }
    };
</script>

<style scoped>
  h1,
  h2 {
    font-family: "Lato", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 500;
  }
  * {
    margin: 0;
    box-sizing: border-box;
  }
  #app {
    background-color: #eceff1;
    overflow: auto;
  }
  header.masthead {
    position: relative;
    background: url("./assets/feedback-2990424_1280.jpeg") no-repeat center center;
    background-size: cover;
    padding-top: 8rem;
    padding-bottom: 8rem;
    height: 500px;
  }

  header.masthead .overlay {
    position: absolute;
    background-color: #212529;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    opacity: 0.3;
  }

  header.masthead h1 {
    font-size: 2rem;
  }

  .header-nav {
    background: #1e90ff;
    background-size: cover;
    padding: 0.4em 0.8em;
    color: black;
  }

  .header-nav h1 {
    text-align: center;
  }
  .expl {
    height: 300px;
  }
  .expl h2 {
    padding: 100px;
  }
  .profile_image {
    border-radius: 20px;
  }

  .content {
    margin: auto;
    padding: 0 10px;
    max-width: 600px;
    background-color: #fff;
    padding: 30px;
    border-radius: 20px;
    margin-bottom: 100px;
    margin-top: 50px;
    height: 700px;
  }
  .form {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 0;
    height: 80px;
    padding: 20px;
    width: 100%;
    background: #f5f5f5;
  }
  .form textarea {
    border: 1px solid #ccc;
    border-radius: 2px;
    height: 4em;
    width: calc(100% - 6em);
    resize: none;
  }

  .chat {
    position: relative;
    display: flex;
    align-items: flex-end;
    margin-bottom: 0.8em;
  }
  .chat-image img {
    border-radius: 20px;
    vertical-align: top;
  }
  .chat-detail {
    margin: 0 0 0 1.4em;
  }
  .chat-name {
    font-size: 75%;
  }
  .chat-message {
    position: relative;
    display: inline-block;
    padding: 0.8em;
    background: #87cefa;
    border-radius: 4px;
    line-height: 1.2em;
  }

  .chat-message::before {
    position: absolute;
    content: " ";
    display: block;
    left: -16px;
    bottom: 12px;
    border: 4px solid transparent;
    border-right: 12px solid #87cefa;
  }
  .send-button {
    height: 4em;
  }

  .chat-enter-active {
    transition: all 1s;
  }
  .chat-enter {
    opacity: 0;
    transform: translateX(-1em);
  }

</style>
