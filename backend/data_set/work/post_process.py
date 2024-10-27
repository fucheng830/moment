import json
import hashlib
with open('经济_result.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def generate_unique_id(text: str, length: int = 10) -> str:
    # 使用SHA-256哈希算法来处理文本
    hash_object = hashlib.sha256(text.encode())
    # 获取哈希值的十六进制表示
    hex_dig = hash_object.hexdigest()
    # 截取所需长度的前缀，确保它是全局唯一的
    unique_id = hex_dig[:length]
    return unique_id
titles = set()
title2id = dict()
for sample in data['guideNotes']:
    if sample['title'] not in titles:
        titles.add(sample['title'])
    else:
        print(sample['title'])
        x=1
    id = generate_unique_id(sample['title'])
    sample['id'] = id
    title2id[sample['title']] = id
    print(id)

for sample in data['guideNotes']:
    title = sample['title']
    new_to = []
    for t in sample['links']['to']:
        if t in titles:
            new_to.append(title2id[t])
    sample['links']['to'] = new_to
with open('经济_result2.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)




