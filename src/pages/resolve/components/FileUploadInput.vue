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
    :error="!isCredentialsLinkValid"
  >
    <template v-slot:prepend>
      <q-icon name="attach_file" id="attach-file-button" />
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
      percentage: 0,
    };
  },
  methods: {
    async onFileSelect() {
      console.log("has attached file");
      const file = document.getElementById("file-input")?.files[0];
      console.log("file to attach: ", file);
      const formData = new FormData();
      console.log(1);
      formData.append("file", file);
      console.log(2);
      let accessToken;
      try {
        console.log(3);
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
        console.log("setting access token", access_token);
        accessToken = access_token;
      } catch (err) {
        console.log("access_token error: ", err);
      }

      let uploadToken;
      try {
        console.log(3);
        const {
          data: { token },
          data,
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
        console.log("setting upload token", token);
        uploadToken = token;
      } catch (err) {
        console.log("upload token error: ", err);
      }

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
          onUploadProgress: function (progressEvent) {
            console.log("progress: ", progressEvent);
            this.percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
          },
        };
        console.log("uploading");
        const {
          data: { Hash },
          data,
        } = await axios.post(
          "https://api.dstor.cloud/v1/upload/",
          formData,
          config
        );
        console.log("data: ", data);
        console.log("Hash: ", Hash);
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
          if (statusData.status === "DONE") clearInterval(statusInterval);
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
