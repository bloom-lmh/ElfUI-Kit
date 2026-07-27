import { defineHtml } from "@elfui/core";

const code = `<elf-slider model-value="35" placement="top" />
<elf-slider model-value="35" placement="bottom" />
<elf-slider model-value="35" placement="left" />
<elf-slider model-value="35" placement="right" />`;

const script = `// placement 支持 top、bottom、left、right。`;

const PageSliderEx8 = defineHtml(`
  <h2>提示位置</h2>
  <elf-playground title="top / bottom / left / right" :code=${code} :script=${script}>
    <div style="display:grid;grid-template-columns:repeat(2,minmax(240px,1fr));gap:56px 72px;width:100%;max-width:720px;padding:24px 48px">
      <elf-slider model-value="35" placement="top"></elf-slider>
      <elf-slider model-value="35" placement="bottom"></elf-slider>
      <elf-slider model-value="35" placement="left"></elf-slider>
      <elf-slider model-value="35" placement="right"></elf-slider>
    </div>
  </elf-playground>
`);

export { PageSliderEx8 };
