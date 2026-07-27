import { defineHtml } from "@elfui/core";

const code4 = `<elf-alert type="info" closable title="点 × 关闭我"></elf-alert>`;

const code5 = `<elf-alert type="info" center :show-icon="false" title="居中无图标"></elf-alert>`;

const code6 = `<elf-alert type="warning" density="compact" title="紧凑模式"></elf-alert>`;

const code7 = `<elf-alert type="info" prominent title="prominent — 粗色条"></elf-alert>`;

const PageAlertEx3 = defineHtml(`
    <h2>可关闭</h2>
    <elf-playground title="closable" :code=${code4}>
        <div style="width:50%">
            <elf-alert type="info" closable title="点 × 关闭我"></elf-alert>
        </div>
    </elf-playground>

    <h2>紧凑模式</h2>
    <elf-playground title="density=compact" :code=${code6}>
        <div style="width:50%;display:flex;flex-direction:column;gap:12px">
            <elf-alert type="info" density="compact" title="紧凑 info"></elf-alert>
            <elf-alert type="success" density="compact" title="紧凑 success"></elf-alert>
            <elf-alert type="warning" density="compact" title="紧凑 warning" description="带描述的紧凑模式"></elf-alert>
            <elf-alert type="danger" density="compact" title="紧凑 danger" closable></elf-alert>
        </div>
    </elf-playground>

    <h2>Prominent 粗色条</h2>
    <elf-playground title="prominent" :code=${code7}>
        <div style="width:50%;display:flex;flex-direction:column;gap:12px">
            <elf-alert type="info" prominent title="prominent info"></elf-alert>
            <elf-alert type="success" prominent title="prominent success"></elf-alert>
            <elf-alert type="warning" prominent title="prominent warning"></elf-alert>
            <elf-alert type="danger" prominent title="prominent danger"></elf-alert>
        </div>
    </elf-playground>

    <h2>居中 + 无图标</h2>
    <elf-playground title="center / show-icon=false" :code=${code5}>
        <div style="width:50%">
            <elf-alert type="info" center :show-icon="false" title="居中无图标"></elf-alert>
        </div>
    </elf-playground>

    <h2>自定义关闭文字</h2>
    <elf-playground title="close-text" :code=${`<elf-alert type="info" closable close-text="知道了" title="使用 close-text 代替 ×"></elf-alert>`}>
        <div style="width:50%">
            <elf-alert type="info" closable close-text="知道了" title="使用 close-text 代替 × 图标"></elf-alert>
        </div>
    </elf-playground>

    <h2>自定义插槽</h2>
    <elf-playground title="title / icon slot" :code=${`<elf-alert type="success">
  <span slot="icon">⭐</span>
  <span slot="title"><strong>自定义标题</strong></span>
  这是 default slot 内容，会替换 description
</elf-alert>`}>
        <div style="width:50%">
            <elf-alert type="success">
                <span slot="icon">⭐</span>
                <span slot="title"><strong>自定义标题（title slot）</strong></span>
                这是 default slot 内容，替换了 description 属性
            </elf-alert>
        </div>
    </elf-playground>
`);

export { PageAlertEx3 };
