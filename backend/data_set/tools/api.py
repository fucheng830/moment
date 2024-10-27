from openai import OpenAI
# from dotenv import load_dotenv
import os

# 加载 .env 文件
# load_dotenv()

client = OpenAI(
    # This is the default and can be omitted
    api_key='sk-daawwylizkfiiqo2',
    base_url='https://cloud.infini-ai.com/maas/qwen2.5-72b-instruct/nvidia/'
)


# base_url=os.environ.get("OPENAI_API_BASE")

# print("无问芯穹的 base_url 格式: \n" + str(client.base_url))

def chat(input):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": input,
            }
        ],
        model="qwen2.5-72b-instruct",
    )
    return chat_completion.choices[0].message.content

if __name__ == '__main__':
    print(chat('你好'))