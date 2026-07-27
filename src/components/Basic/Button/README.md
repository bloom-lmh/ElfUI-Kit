# Button 按钮

常用操作按钮，Material Design 风格。支持 3 种变体、6 种语义颜色、3 种尺寸。

## 用法

```html
<elf-button>默认</elf-button>
<elf-button variant="outlined" color="success">轮廓成功</elf-button>
<elf-button variant="text" color="danger">文字危险</elf-button>
<elf-button loading>加载中</elf-button>
<elf-button disabled>禁用</elf-button>
<elf-button block>占满整行</elf-button>
<elf-button circle icon="↻" aria-label="刷新数据"></elf-button>

<form>
  <elf-button type="submit">提交</elf-button>
  <elf-button type="reset" variant="outlined">重置</elf-button>
</form>
```

## Props

| 名称       | 类型                                                           | 默认值      | 说明             |
| ---------- | -------------------------------------------------------------- | ----------- | ---------------- |
| `variant`  | `contained \| outlined \| text`                                | `contained` | 按钮样式         |
| `color`    | `primary \| secondary \| success \| warning \| danger \| info` | `primary`   | 语义颜色         |
| `size`     | `sm \| md \| lg`                                               | `md`        | 尺寸             |
| `disabled` | `boolean`                                                      | `false`     | 禁用             |
| `loading`  | `boolean`                                                      | `false`     | 显示 spinner     |
| `block`    | `boolean`                                                      | `false`     | 占满父容器宽度   |
| `type`     | `ButtonColor \| button \| submit \| reset`                      | `""`        | 语义色别名或原生 button type |
| `native-type` | `button \| submit \| reset`                                 | `button`    | 原生 button type |
| `aria-label` | `string`                                                     | `""`        | 纯图标按钮的无障碍名称 |
| `form`     | `string`                                                       | `""`        | 显式关联外层表单 ID |

## Events

| 名称    | 参数              | 说明                            |
| ------- | ----------------- | ------------------------------- |
| `click` | `(e: MouseEvent)` | 点击；disabled/loading 时被吞掉 |

## Parts

| 名称     | 说明                                          |
| -------- | --------------------------------------------- |
| `button` | 内部 `<button>`，可用 `::part(button)` 自定义 |

## 设计

- 颜色 / 尺寸 / 变体走 attribute selector + CSS 变量驱动；JS 层只处理 disabled/loading 拦截
- click 不在内部 emit，让浏览器原生冒泡到 host，避免重复
- submit/reset 在内部按钮没有原生 form owner 时桥接到最近的外层表单；`preventDefault()` 仍可取消提交
- `aria-label` 会转发到真正可聚焦的内部按钮
- focus-visible 样式跟随当前 color，符合 a11y
