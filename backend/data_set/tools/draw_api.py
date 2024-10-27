from openai import OpenAI
# from dotenv import load_dotenv
import os

# 加载 .env 文件
# load_dotenv()

client = OpenAI(
    # This is the default and can be omitted
    api_key='sk-daawwylizkfiiqo2',
    base_url='https://cloud.infini-ai.com/maas/stable-diffusion-1.5/nvidia/'
)


# curl --request POST \
#   --url https://cloud.infini-ai.com/maas/stable-diffusion-1.5/nvidia/chat/completions \
#   --header "Authorization: Bearer $API_KEY" \
#   --header "Content-Type: application/json" \
#   --data '{
#         "model": "stable-diffusion-1.5",
#         "messages": [
#           {"role": "user", "content":"你是谁"}
#         ]
#       }'

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
        model="stable-diffusion-1.5",
    )
    return chat_completion.choices[0].message.content

if __name__ == '__main__':
    result = chat('画一幅图')
    x=1