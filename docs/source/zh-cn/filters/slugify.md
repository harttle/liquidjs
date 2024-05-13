---
title: slugify
---

将字符串转换为小写的 URL “slug”。`slugify` 过滤器接受两个选项：

1. `mode: string`。默认为`"default"`，它可选的值如下：
   - `"none"`：没有字符
   - `"raw"`：空格
   - `"default"`：空格和非字母数字字符
   - `"pretty"`：空格和非字母数字字符，但排除 `._~!$&'()+,;=@`
   - `"ascii"`：空格、非字母数字和非 ASCII 字符
   - `"latin"`：与默认相同，但拉丁字符首先进行音译（例如，àèïòü 转换为 aeiou）。
2. `case: boolean`。默认为 `false`。如果为 `true`，则保留 `slug` 原本的大小写。

输入
```liquid
{{ "The _config.yml file" | slugify }}
```
输出
```
the-config-yml-file
```

输入
```liquid
{{ "The _config.yml file" | slugify: "pretty" }}
```
输出
```
the-_config.yml-file
```

输入
```liquid
{{ "The _cönfig.yml file" | slugify: "ascii" }}
```
输出
```
the-c-nfig-yml-file
```

输入
```liquid
{{ "The cönfig.yml file" | slugify: "latin" }}
```
输出
```
the-config-yml-file
```

输入
```liquid
{{ "The cönfig.yml file" | slugify: "latin", true }}
```
输出
```
The-config-yml-file
```
