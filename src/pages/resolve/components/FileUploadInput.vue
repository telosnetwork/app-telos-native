<template>
  <q-input
    filled
    v-model="credentialsLink"
    label="Info Link"
    bottom-slots
    hint="46 or 49 character IPFS hash"
    error-message="Must be valid IPFS hash (ie 'Qmdn7bZ8z25b...')"
    dense
    autofocus
    :loading="isUploading"
  >
    <template v-slot:prepend>
      <q-icon name="attach_file" id="attach-file-button" />
    </template>
    <template v-slot:loading>
      <q-circular-progress
        :value="progress"
        size="24px"
        color="primary"
        class="q-ma-md"
      />
    </template>
    <input type="file" id="file-input" />
  </q-input>
</template>

<script>
import axios from "axios";
import { validateIpfsHash } from "../util";

export default {
  data() {
    return {
      credentialsLink: "",
      progress: 0,
      isUploading: true,
    };
  },
  methods: {
    async onFileSelect() {
      this.isUploading = true;
      this.credentialsLink = "";
      const file = document.getElementById("file-input")?.files[0];
      const formData = new FormData();
      formData.append("file", file);
      let accessToken;
      try {
        const {
          data: { access_token },
        } = await axios({
          url: "https://api.dstor.cloud/v1/dev/temp-token",
          headers: {
            "api-key":
              "OY77xJwvfIucJxOsv9h9IEGGUCKbFlmXkKdKz2HsjJhjwmlixyxUaer9D7ekXrPg",
            "x-expiration": new Date().getTime() / 1000 + 3600,
          },
        });
        this.progress = 10;
        accessToken = access_token;
      } catch (err) {
        console.log("access_token error: ", err);
      }

      let uploadToken;
      try {
        console.log(3);
        const {
          data: { token },
        } = await axios({
          method: "POST",
          url: "https://api.dstor.cloud/v1/upload/get-token/",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: {
            chunks_number: 1,
            folder_path: "test",
          },
        });
        this.progress = 20;
        uploadToken = token;
      } catch (err) {
        console.log("upload token error: ", err);
      }

      const updateProgress = (event) => {
        console.log("progress: ", event);
        this.progress =
          Math.round((event.loaded * 100) / event.total) * 0.4 + 30;
        console.log(this.progress);
      };

      try {
        const config = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // "Access-Control-Allow-Origin": "*",
            "Content-Type": "multipart/form-data",
            // "x-dstor-parent-id": 0, // root folder,
            "x-dstor-comment": `Upload from Resolve by ${this.account}`,
            "x-dstor-upload-token": uploadToken,
          },
          onUploadProgress: updateProgress,
        };
        console.log("uploading");
        const { data } = await axios.post(
          "https://api.dstor.cloud/v1/upload/",
          formData,
          config
        );
      } catch (err) {
        console.log("upload error: ", err);
      }

      const checkStatus = async () => {
        try {
          const { data: statusData } = await axios(
            "https://api.dstor.cloud/v1/upload/get-status/",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "x-dstor-upload-token": uploadToken,
              },
            }
          );
          console.log("statusData: ", statusData);
          switch (statusData.status) {
            case "ADDING_TO_IPFS":
              this.progress = 80;
              break;
            case "SAVING_DATA":
              this.progress = 90;
              break;
            case "DONE":
              clearInterval(statusInterval);
              this.progress = 100;
              this.credentialsLink = statusData.data[0].Hash;
              setTimeout(() => {
                this.isUploading = false;
                this.progress = 0;
              }, 2000);
          }
        } catch (err) {
          console.log("status error: ", err);
        }
      };

      let statusInterval = setInterval(checkStatus, 2000);
    },
  },
  computed: {
    isCredentialsLinkValid() {
      return validateIpfsHash(this.credentialsLink);
    },
  },
  mounted: function () {
    console.log(
      "initElectionModal mounted, this.$store.state",
      // @ts-ignore
      this.$store.state
    );
    const fileSelect = document.getElementById("attach-file-button");
    const fileElem = document.getElementById("file-input");
    fileElem.addEventListener("change", this.onFileSelect);
    fileSelect.addEventListener(
      "click",
      (e) => {
        if (fileElem) {
          fileElem.click();
        }
      },
      false
    );
  },
};
</script>

<style lang="scss" scoped>
#attach-file-button {
  &:hover {
    cursor: pointer;
  }
}

#file-input {
  display: none;
}
</style>
