import { defineHtml } from "@elfui/core";

const code1 = `<elf-card style="max-width:480px;width:100%">
  <elf-skeleton loading variant="image" width="100%" height="180px" />
  <div style="padding:20px 20px 0">
    <elf-skeleton loading variant="text" width="60%" height="20px" />
    <div style="height:6px"></div>
    <elf-skeleton loading variant="text" width="40%" height="14px" />
  </div>
  <div style="padding:20px">
    <elf-skeleton loading variant="text" count="3" gap="8px" />
  </div>
  <div style="padding:0 20px 16px;display:flex;gap:8px;justify-content:flex-end">
    <elf-skeleton loading variant="rect" width="60px" height="32px" />
    <elf-skeleton loading variant="rect" width="60px" height="32px" />
  </div>
</elf-card>`;

const code2 = `<div style="display:flex;flex-direction:column;gap:16px;width:360px">
  <div style="display:flex;gap:12px;align-items:center">
    <elf-skeleton loading variant="circle" width="48px" height="48px" />
    <div style="flex:1;display:flex;flex-direction:column;gap:6px">
      <elf-skeleton loading variant="text" width="50%" height="14px" />
      <elf-skeleton loading variant="text" width="70%" height="12px" />
    </div>
  </div>
  <div style="display:flex;gap:12px;align-items:center">
    <elf-skeleton loading variant="circle" width="48px" height="48px" />
    <div style="flex:1;display:flex;flex-direction:column;gap:6px">
      <elf-skeleton loading variant="text" width="40%" height="14px" />
      <elf-skeleton loading variant="text" width="60%" height="12px" />
    </div>
  </div>
  <div style="display:flex;gap:12px;align-items:center">
    <elf-skeleton loading variant="circle" width="48px" height="48px" />
    <div style="flex:1;display:flex;flex-direction:column;gap:6px">
      <elf-skeleton loading variant="text" width="55%" height="14px" />
      <elf-skeleton loading variant="text" width="65%" height="12px" />
    </div>
  </div>
</div>`;

const code3 = `<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;width:100%;max-width:720px">
  <elf-card>
    <div style="padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <elf-skeleton loading variant="text" width="55%" height="16px" />
        <elf-skeleton loading variant="circle" width="28px" height="28px" />
      </div>
      <div style="display:flex;align-items:flex-end;gap:6px;height:70px">
        <elf-skeleton loading variant="rect" width="14%" height="38px" /><elf-skeleton loading variant="rect" width="14%" height="55px" /><elf-skeleton loading variant="rect" width="14%" height="32px" /><elf-skeleton loading variant="rect" width="14%" height="68px" /><elf-skeleton loading variant="rect" width="14%" height="44px" /><elf-skeleton loading variant="rect" width="14%" height="52px" />
      </div>
      <div style="margin:8px 0 14px 0;border-bottom:1px solid var(--elf-border)"></div>
      <elf-skeleton loading variant="text" width="72%" height="16px" /><div style="height:6px"></div>
      <elf-skeleton loading variant="text" width="48%" />
    </div>
  </elf-card>
  <elf-card>
    <div style="padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <elf-skeleton loading variant="text" width="45%" height="16px" />
        <elf-skeleton loading variant="circle" width="28px" height="28px" />
      </div>
      <div style="display:flex;align-items:flex-end;gap:6px;height:70px">
        <elf-skeleton loading variant="rect" width="14%" height="50px" /><elf-skeleton loading variant="rect" width="14%" height="35px" /><elf-skeleton loading variant="rect" width="14%" height="62px" /><elf-skeleton loading variant="rect" width="14%" height="28px" /><elf-skeleton loading variant="rect" width="14%" height="58px" /><elf-skeleton loading variant="rect" width="14%" height="42px" />
      </div>
      <div style="margin:8px 0 14px 0;border-bottom:1px solid var(--elf-border)"></div>
      <elf-skeleton loading variant="text" width="60%" height="16px" /><div style="height:6px"></div>
      <elf-skeleton loading variant="text" width="42%" />
    </div>
  </elf-card>
  <elf-card>
    <div style="padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <elf-skeleton loading variant="text" width="62%" height="16px" />
        <elf-skeleton loading variant="circle" width="28px" height="28px" />
      </div>
      <div style="display:flex;align-items:flex-end;gap:6px;height:70px">
        <elf-skeleton loading variant="rect" width="14%" height="42px" /><elf-skeleton loading variant="rect" width="14%" height="60px" /><elf-skeleton loading variant="rect" width="14%" height="36px" /><elf-skeleton loading variant="rect" width="14%" height="70px" /><elf-skeleton loading variant="rect" width="14%" height="48px" /><elf-skeleton loading variant="rect" width="14%" height="56px" />
      </div>
      <div style="margin:8px 0 14px 0;border-bottom:1px solid var(--elf-border)"></div>
      <elf-skeleton loading variant="text" width="68%" height="16px" /><div style="height:6px"></div>
      <elf-skeleton loading variant="text" width="52%" />
    </div>
  </elf-card>
  <elf-card>
    <div style="padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <elf-skeleton loading variant="text" width="50%" height="16px" />
        <elf-skeleton loading variant="circle" width="28px" height="28px" />
      </div>
      <div style="display:flex;align-items:flex-end;gap:6px;height:70px">
        <elf-skeleton loading variant="rect" width="14%" height="48px" /><elf-skeleton loading variant="rect" width="14%" height="64px" /><elf-skeleton loading variant="rect" width="14%" height="30px" /><elf-skeleton loading variant="rect" width="14%" height="58px" /><elf-skeleton loading variant="rect" width="14%" height="40px" /><elf-skeleton loading variant="rect" width="14%" height="66px" />
      </div>
      <div style="margin:8px 0 14px 0;border-bottom:1px solid var(--elf-border)"></div>
      <elf-skeleton loading variant="text" width="65%" height="16px" /><div style="height:6px"></div>
      <elf-skeleton loading variant="text" width="44%" />
    </div>
  </elf-card>
</div>`;

const PageSkeletonEx2 = defineHtml(`
  <h2>卡片骨架</h2>
  <elf-playground title="图片 + 标题 + 正文 + 按钮占位" :code="code1">
    <elf-card style="max-width:480px;width:100%;pointer-events:none">
      <elf-skeleton loading variant="image" width="100%" height="180px" />
      <div style="padding:20px 20px 0">
        <elf-skeleton loading variant="text" width="60%" height="20px" />
        <div style="height:6px"></div>
        <elf-skeleton loading variant="text" width="40%" height="14px" />
      </div>
      <div style="padding:20px">
        <elf-skeleton loading variant="text" count="3" gap="8px" />
      </div>
      <div style="padding:0 20px 16px;display:flex;gap:8px;justify-content:flex-end">
        <elf-skeleton loading variant="rect" width="60px" height="32px" />
        <elf-skeleton loading variant="rect" width="60px" height="32px" />
      </div>
    </elf-card>
  </elf-playground>

  <h2>列表骨架</h2>
  <elf-playground title="头像 + 两行文字 × 3" :code="code2">
    <div style="display:flex;flex-direction:column;gap:16px;width:360px">
      <div style="display:flex;gap:12px;align-items:center">
        <elf-skeleton loading variant="circle" width="48px" height="48px" />
        <div style="flex:1;display:flex;flex-direction:column;gap:6px">
          <elf-skeleton loading variant="text" width="50%" height="14px" />
          <elf-skeleton loading variant="text" width="70%" height="12px" />
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:center">
        <elf-skeleton loading variant="circle" width="48px" height="48px" />
        <div style="flex:1;display:flex;flex-direction:column;gap:6px">
          <elf-skeleton loading variant="text" width="40%" height="14px" />
          <elf-skeleton loading variant="text" width="60%" height="12px" />
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:center">
        <elf-skeleton loading variant="circle" width="48px" height="48px" />
        <div style="flex:1;display:flex;flex-direction:column;gap:6px">
          <elf-skeleton loading variant="text" width="55%" height="14px" />
          <elf-skeleton loading variant="text" width="65%" height="12px" />
        </div>
      </div>
    </div>
  </elf-playground>

  <h2>Dashboard 骨架</h2>
  <elf-playground title="2×2 卡片网格" :code="code3">
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;width:100%;max-width:720px">
      <elf-card style="pointer-events:none">
        <div style="padding:20px">
          <div
            style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px"
          >
            <elf-skeleton loading variant="text" width="55%" height="16px" />
            <elf-skeleton loading variant="circle" width="28px" height="28px" />
          </div>
          <div style="display:flex;align-items:flex-end;gap:6px;height:70px">
            <elf-skeleton loading variant="rect" width="14%" height="38px" /><elf-skeleton loading
              variant="rect"
              width="14%"
              height="55px"
            /><elf-skeleton loading variant="rect" width="14%" height="32px" /><elf-skeleton loading
              variant="rect"
              width="14%"
              height="68px"
            /><elf-skeleton loading variant="rect" width="14%" height="44px" /><elf-skeleton loading
              variant="rect"
              width="14%"
              height="52px"
            />
          </div>
          <div style="margin:8px 0 14px 0;border-bottom:1px solid var(--elf-border)"></div>
          <elf-skeleton loading variant="text" width="72%" height="16px" />
          <div style="height:6px"></div>
          <elf-skeleton loading variant="text" width="48%" />
        </div>
      </elf-card>
      <elf-card style="pointer-events:none">
        <div style="padding:20px">
          <div
            style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px"
          >
            <elf-skeleton loading variant="text" width="45%" height="16px" />
            <elf-skeleton loading variant="circle" width="28px" height="28px" />
          </div>
          <div style="display:flex;align-items:flex-end;gap:6px;height:70px">
            <elf-skeleton loading variant="rect" width="14%" height="50px" /><elf-skeleton loading
              variant="rect"
              width="14%"
              height="35px"
            /><elf-skeleton loading variant="rect" width="14%" height="62px" /><elf-skeleton loading
              variant="rect"
              width="14%"
              height="28px"
            /><elf-skeleton loading variant="rect" width="14%" height="58px" /><elf-skeleton loading
              variant="rect"
              width="14%"
              height="42px"
            />
          </div>
          <div style="margin:8px 0 14px 0;border-bottom:1px solid var(--elf-border)"></div>
          <elf-skeleton loading variant="text" width="60%" height="16px" />
          <div style="height:6px"></div>
          <elf-skeleton loading variant="text" width="42%" />
        </div>
      </elf-card>
      <elf-card style="pointer-events:none">
        <div style="padding:20px">
          <div
            style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px"
          >
            <elf-skeleton loading variant="text" width="62%" height="16px" />
            <elf-skeleton loading variant="circle" width="28px" height="28px" />
          </div>
          <div style="display:flex;align-items:flex-end;gap:6px;height:70px">
            <elf-skeleton loading variant="rect" width="14%" height="42px" /><elf-skeleton loading
              variant="rect"
              width="14%"
              height="60px"
            /><elf-skeleton loading variant="rect" width="14%" height="36px" /><elf-skeleton loading
              variant="rect"
              width="14%"
              height="70px"
            /><elf-skeleton loading variant="rect" width="14%" height="48px" /><elf-skeleton loading
              variant="rect"
              width="14%"
              height="56px"
            />
          </div>
          <div style="margin:8px 0 14px 0;border-bottom:1px solid var(--elf-border)"></div>
          <elf-skeleton loading variant="text" width="68%" height="16px" />
          <div style="height:6px"></div>
          <elf-skeleton loading variant="text" width="52%" />
        </div>
      </elf-card>
      <elf-card style="pointer-events:none">
        <div style="padding:20px">
          <div
            style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px"
          >
            <elf-skeleton loading variant="text" width="50%" height="16px" />
            <elf-skeleton loading variant="circle" width="28px" height="28px" />
          </div>
          <div style="display:flex;align-items:flex-end;gap:6px;height:70px">
            <elf-skeleton loading variant="rect" width="14%" height="48px" /><elf-skeleton loading
              variant="rect"
              width="14%"
              height="64px"
            /><elf-skeleton loading variant="rect" width="14%" height="30px" /><elf-skeleton loading
              variant="rect"
              width="14%"
              height="58px"
            /><elf-skeleton loading variant="rect" width="14%" height="40px" /><elf-skeleton loading
              variant="rect"
              width="14%"
              height="66px"
            />
          </div>
          <div style="margin:8px 0 14px 0;border-bottom:1px solid var(--elf-border)"></div>
          <elf-skeleton loading variant="text" width="65%" height="16px" />
          <div style="height:6px"></div>
          <elf-skeleton loading variant="text" width="44%" />
        </div>
      </elf-card>
    </div>
  </elf-playground>
`);

export { PageSkeletonEx2 };
