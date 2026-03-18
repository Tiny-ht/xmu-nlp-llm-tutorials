---
title: 2.调用大模型 API
nav_order: 3
---

## 调用大模型 API 教程

---

## 一、接口类型

接口类型主要分为两类，`Chat` 和 `Completion`。

1. `Completion` 接口的核心思路是“文本补全”。你给模型一段 prompt，它继续往后生成内容。它的输入通常就是一段纯文本，形式简单，适合较早期的文本生成任务，或者本身就是单轮补全的场景。

2. `Chat` 接口的核心思路是“消息交互”。你传入的是一组消息，例如 `system`、`user`、`assistant`，模型会基于整段对话上下文进行回复。它更适合多轮交流、角色设定、上下文管理，也是现在更常见的大模型调用方式。

## 二、安装核心依赖

很多大模型厂商都提供 OpenAI 兼容接口，因此安装 `openai` 这个核心依赖即可：

```bash
pip install openai
```

## 三、获取 API Key

常用的模型提供商：

- [OpenRouter](https://openrouter.ai/)：模型最全、响应速度快，服务稳定，账户余额大于 10 美金，每天有 1000 次的免费模型调用额度，缺点是想要使用付费模型的话价格较高。
- 国内厂商：基本注册就会送一定量的 token
  - [火山方舟](https://www.volcengine.com/docs/82379)：豆包（Doubao）全系列 + 少量第三方（DeepSeek、MiniMax 等）。
  - [百炼](https://www.aliyun.com/product/bailian)：通义千问（Qwen）全系列（Qwen-Plus、Qwen-72B、Qwen-VL 等）+ 第三方（DeepSeek、Kimi、GLM、Llama 等）
  - [硅基流动](https://www.siliconflow.cn/)：国产开源为主（Qwen、DeepSeek、Llama、CodeLlama 等），闭源少。

除了上述途径之外，也有一些价格极低的中转站，主要针对 ChatGPT、Claude、Gemini 等闭源模型，在此不做推荐。同学们可自行搜索，也可咨询助教。

## 四、调用模型

下面以一个实际例子来说明如何调用模型：

关键参数：

- `Base_URL`：接口地址。不同平台的请求入口不同，如果填错，程序就无法正确调用对应厂商的模型服务。例如 OpenRouter 的接口地址是 `https://openrouter.ai/api/v1`。
- `API_KEY`：访问密钥，用来证明你有权限调用该平台的 API。它相当于账号口令，不要泄露给他人，也不要直接写进公开代码仓库。
- `Model`：模型名称，用来指定你这次到底调用哪一个模型，例如 `gpt-4o-mini`、`qwen-plus`、`deepseek-chat` 等。不同平台支持的模型名不同。
- `temperature`：控制生成结果的随机性。值越低，输出通常越稳定；值越高，输出通常越发散、更有创造性。

### 1. 初始化客户端

```python
from openai import OpenAI

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="<OPENROUTER_API_KEY>",
)
```

这一步的作用是创建客户端。`base_url` 用来指定请求入口，`api_key` 用来完成身份认证。只有先初始化客户端，后面才能正常发起模型调用。

### 2. 单轮调用

```python
response = client.chat.completions.create(
  model="minimax/minimax-m2.7",
  messages=[
    {
      "role": "user",
      "content": "How many r's are in the word 'strawberry'?"
    }
  ],
  extra_body={"reasoning": {"enabled": True}}
)
```

单轮调用就是直接给模型一轮输入，让它返回一轮结果。这里调用的是 `client.chat.completions.create(...)`，其中 `Model` 指定本次使用的模型，`messages` 里只放当前这一轮的问题。

### 3. 多轮调用

```python
response = response.choices[0].message

messages = [
  {"role": "user", "content": "How many r's are in the word 'strawberry'?"},
  {
    "role": "assistant",
    "content": response.content,
    "reasoning_details": response.reasoning_details
  },
  {"role": "user", "content": "Are you sure? Think carefully."}
]

response2 = client.chat.completions.create(
  model="minimax/minimax-m2.7",
  messages=messages,
  extra_body={"reasoning": {"enabled": True}}
)
```

多轮调用是在上一轮结果的基础上继续提问。这里先取出第一轮返回的消息，再把第一轮的用户输入、模型回答和 `reasoning_details` 一起放回 `messages`，最后追加新的用户问题。这样第二次调用时，模型就能基于上一轮上下文继续回答，而不是从头开始。

## 五、注意事项

注意保护好自己的 `API_KEY`，不要直接写进公开代码仓库。更推荐新建 `.env` 文件保存密钥，再在代码里配合 `load_dotenv()` 读取。

```bash
OPENROUTER_API_KEY=sk-or-v1-xxxxxx
```

```python
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("OPENROUTER_API_KEY")
```

如果只是临时运行一次脚本，也可以在执行脚本时临时传参，这种方式仅本次运行有效：

```bash
OPENROUTER_API_KEY=sk-or-v1-xxxxxx python your_script.py
```
