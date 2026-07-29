import { defineHtml } from "@elfui/core";

const dragCode = `<elf-upload drag accept="image/*" list-type="picture-card" />`;

const PageUploadEx2 = defineHtml(`
<elf-playground title="拖拽与图片卡片" :code=${dragCode}>
      <div style="display:grid;place-items:center;width:100%">
        <elf-upload
          style="width:min(100%,720px)"
          drag
          accept="image/*"
          list-type="picture-card"
          button-text="上传图片"
          tip="支持拖拽图片，也可以点击选择。"
        ></elf-upload>
      </div>
    </elf-playground>
`);

export { PageUploadEx2 };
