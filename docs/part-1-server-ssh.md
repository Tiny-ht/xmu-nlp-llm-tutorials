---
title: 1.连接服务器
nav_order: 2
---

## 服务器 SSH 连接教程

---

## 一、终端方式连接（通用）

### 1. 打开终端

- Windows：开始菜单 -> 搜索 `终端` 或 `PowerShell`
- macOS：按 `Command + 空格` 打开 Spotlight，然后搜索 `终端`

### 2. 执行 SSH 连接命令

在终端中输入以下命令：

```bash
ssh -p 58003 user@hpc.wisesoe.com
```

如果你当前在校园网内，可改用：

```bash
ssh -p 58003 user@hpcxmu.wisesoe.com
```

其中 `user` 改为你自己的用户名。

### 3. 首次连接验证

首次登录会出现如下提示：

```text
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

必须输入完整的 `yes` 并回车（只输 `y` 无效）。

### 4. 输入密码

输入助教发放的服务器密码。

输入时屏幕不会显示任何字符，属于正常安全机制，输完直接回车。

出现类似如下提示即登录成功：

```text
Welcome to Ubuntu ...
Last login: ...
```

---

## 二、VS Code 远程连接（推荐，更易用）

适合编写代码、查看文件、运行实验。

### 1. 安装插件

打开 VS Code 扩展商店并搜索安装：

- Windows / Linux：`Ctrl + Shift + X`
- macOS：`Command + Shift + X`

```text
Remote - SSH
```

### 2. 添加服务器配置

1. 按 `F1` 打开命令面板（macOS 可按 `fn + F1`）
2. 输入并选择：`Remote-SSH: Add New SSH Host...`

   ![Add New SSH Host]({{ '/add_ssh.png' | relative_url }})
   {: .doc-screenshot }

3. 输入连接命令：

   ```bash
   ssh -p 58003 user@hpc.wisesoe.com
   ```

   如果你当前在校园网内，可改用：

   ```bash
   ssh -p 58003 user@hpcxmu.wisesoe.com
   ```

4. 选择保存到默认配置文件（一般第一个）

### 3. 连接服务器

1. 左侧点击“远程资源管理器”

   ![Remote Explorer]({{ '/connect.png' | relative_url }})
   {: .doc-screenshot .doc-screenshot--narrow }

2. 找到刚添加的服务器 -> 点击 `连接到主机`
3. 选择平台：`Linux`
4. 输入密码，即可成功远程打开服务器文件夹

---

## 三、常见问题与解决

### 1. Operation timed out / 连接超时

- 原因：服务器地址选择错误、当前网络异常，或开启了其他代理工具
- 解决：确认自己是否处于校园网环境；非校园网使用 `hpc.wisesoe.com`，校园网使用 `hpcxmu.wisesoe.com`；同时检查是否开启了 `Clash` 等代理工具，如有开启建议先关闭后重试

### 2. Permission denied, please try again

- 原因：密码错误
- 解决：核对助教提供的密码，注意区分大小写

---

## 四、注意事项

1. 现机器有 7 张 3090 计算卡，请执行代码时指定计算卡，不然会对其它程序造成干扰，甚至导致显存溢出。譬如指定方式：

   ```bash
   CUDA_VISIBLE_DEVICES=4 python train_llm.py
   ```

2. 机器现有一个公共环境，名称为 `base`，配置 `cuda12.1`、`torch2.5.1`
3. 若有个人需求，请自行新建环境
4. 机器连接方法请见上文
5. 禁止一次性占用多卡
6. 卡数量有限，是多人共用
7. 账号超过有效期无法登录，请及时备份数据和代码
8. 账号禁止外借，若发现，列入黑名单

### 重要说明

1. 服务器硬盘无备份措施，请自行保管好数据和代码
2. 资源紧张时，会多人共用一张计算卡

### 请规范使用

- 无关数据请及时清除，释放硬盘空间
- 无关计算请及时停止，释放内存、CPU、GPU 资源
