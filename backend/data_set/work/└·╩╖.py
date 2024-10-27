import requests
import time
from hunyuan_api import hunyuan_api
from tqdm import tqdm
china_history = {
    "中国历史": {
        "夏朝": {
            "重要人物": ["禹", "启", "太康", "羿", "桀"],
            "重要事件": ["大禹治水", "建立世袭制", "太康失国", "夏商战争"]
        },
        "商朝": {
            "重要人物": ["成汤", "商纣王", "武丁", "妇好", "盘庚", "商汤", "比干", "箕子", "武乙", "仲丁"],
            "重要事件": ["汤武革命", "牧野之战", "盘庚迁殷", "鹿台奢靡"]
        },
        "周朝": {
            "重要人物": ["周文王", "周武王", "周公旦", "姬昌", "姬发", "周厉王", "周幽王", "姜太公", "卫武公", "管仲"],
            "重要事件": ["封建制", "西周灭亡", "东周分裂", "井田制", "烽火戏诸侯"]
        },
        "秦朝": {
            "重要人物": ["秦始皇", "李斯", "蒙恬", "赵高", "胡亥", "王翦", "章邯", "陈胜", "吴广", "扶苏"],
            "重要事件": ["统一六国", "焚书坑儒", "修建长城", "阿房宫建造", "秦朝覆灭"]
        },
        "汉朝": {
            "重要人物": ["刘邦", "汉武帝", "王莽", "张骞", "汉光武帝", "卫青", "霍去病", "吕后", "司马迁", "班固"],
            "重要事件": ["楚汉战争", "文景之治", "王莽篡汉", "张骞出使西域", "赤眉起义"]
        },
        "三国": {
            "重要人物": ["曹操", "刘备", "孙权", "诸葛亮", "司马懿", "周瑜", "吕布", "关羽", "张飞", "袁绍"],
            "重要事件": ["赤壁之战", "三国鼎立", "夷陵之战", "官渡之战"]
        },
        "晋朝": {
            "重要人物": ["司马炎", "司马懿", "司马昭", "王羲之", "竹林七贤", "石勒", "桓温", "司马德宗", "谢安", "谢玄"],
            "重要事件": ["西晋统一", "八王之乱", "淝水之战", "永嘉南渡"]
        },
        "南北朝": {
            "重要人物": ["刘裕", "拓跋焘", "北魏孝文帝", "梁武帝", "陈霸先", "萧衍", "侯景", "高洋", "宇文泰", "独孤信"],
            "重要事件": ["南北对峙", "北魏孝文帝改革", "兵制改革", "侯景之乱"]
        },
        "隋朝": {
            "重要人物": ["隋文帝", "隋炀帝", "杨素", "杨广", "杨勇", "裴矩", "虞世基", "李渊", "杨玄感", "李靖"],
            "重要事件": ["开皇之治", "大运河开通", "高句丽战争", "隋末农民起义"]
        },
        "唐朝": {
            "重要人物": ["李世民", "武则天", "唐玄宗", "李白", "杜甫", "杨贵妃", "安禄山", "郭子仪", "李隆基", "玄奘"],
            "重要事件": ["玄武门之变", "开元盛世", "安史之乱", "黄巢起义", "昭宗即位"]
        },
        "五代十国": {
            "重要人物": ["朱温", "李存勖", "郭威", "石敬瑭", "刘知远", "李煜", "冯道", "后晋高祖", "钱镠", "王建"],
            "重要事件": ["五代更迭", "藩镇割据", "后梁建立", "契丹南侵"]
        },
        "宋朝": {
            "重要人物": ["赵匡胤", "岳飞", "苏轼", "秦桧", "王安石", "赵构", "包拯", "宋徽宗", "宋高宗", "李清照"],
            "重要事件": ["陈桥兵变", "靖康之耻", "王安石变法", "杯酒释兵权", "苏湖熟，天下足"]
        },
        "元朝": {
            "重要人物": ["忽必烈", "成吉思汗", "元世祖", "伯颜", "铁木真", "拔都", "郑和", "哈剌哈孙", "贞德太后", "海山"],
            "重要事件": ["蒙古西征", "设立行省制度", "南宋灭亡", "四大汗国形成"]
        },
        "明朝": {
            "重要人物": ["朱元璋", "郑和", "张居正", "海瑞", "永乐大帝", "朱棣", "戚继光", "王阳明", "李时珍", "胡惟庸"],
            "重要事件": ["靖难之役", "土木堡之变", "张居正改革", "郑和下西洋", "抗倭援朝"]
        },
        "清朝": {
            "重要人物": ["康熙帝", "雍正帝", "乾隆帝", "慈禧太后", "林则徐", "光绪帝", "李鸿章", "左宗棠", "慈安", "孙中山"],
            "重要事件": ["康乾盛世", "鸦片战争", "戊戌变法", "辛亥革命", "太平天国运动", "义和团运动"]
        }
    }
}

# def get_wikipedia_extract(page_title, language="zh"):
#     endpoint = f"https://{language}.wikipedia.org/w/api.php"
#     params = {
#         "action": "query",
#         "format": "json",
#         "prop": "extracts",
#         "explaintext": True,
#         "titles": page_title
#     }
#
#     response = requests.get(endpoint, params=params)
#     data = response.json()
#
#     pages = data['query']['pages']
#     for page_id, page in pages.items():
#         extract = page.get('extract', '')
#         return extract


import requests


def search_wikipedia(term, language="zh"):
    endpoint = f"https://{language}.wikipedia.org/w/api.php"
    params = {
        "action": "opensearch",
        "search": term,
        "limit": 1,
        "namespace": 0,
        "format": "json"
    }

    response = requests.get(endpoint, params=params)
    data = response.json()

    # 返回最匹配的条目标题
    if data[1]:
        return data[1][0]
    return None


def get_wikipedia_extract(page_title, language="zh"):
    endpoint = f"https://{language}.wikipedia.org/w/api.php"
    params = {
        "action": "query",
        "format": "json",
        "prop": "extracts",
        "explaintext": True,
        "titles": page_title
    }

    response = requests.get(endpoint, params=params)
    data = response.json()

    pages = data['query']['pages']
    for page_id, page in pages.items():
        extract = page.get('extract', '')
        return extract


def find_closest_article_and_extract(term, language="zh"):
    closest_title = search_wikipedia(term, language)
    if closest_title is not None:
        extract = get_wikipedia_extract(closest_title, language)
        return extract
    return ""

find_closest_article_and_extract('夏商战争')
# Example usage
# print(find_closest_article_and_extract("你的关键词"))
# 查询 "李小龙"
# content = get_wikipedia_extract("唐太宗")

from api import chat
# query = "'''{}'''，请根据以上内容介绍，总结最重要的知识笔记，每个知识点会有一个小标题，知识点不用完整的句子，可以用短语，比如“身份：XXX皇帝”。输出用markdown格式展示，字数严格在200字以内。".format(content)
# query = '''## 角色扮演
# Cool Teacher
#
# ## 基本信息
# - 作者: 李继刚
# - 版本: 3.7
# - 描述: 你是世界上最 Cool 的老师. 擅长使用最简单的词汇和通俗的语言来教会 0 基础的学生.
#
# ## 激灵起来
# 有很多求知若渴的年轻人, 对于概念的学习难以快速深入掌握. 你作为伟大的物理学家费曼的亲传弟子, 有义务和能力站出来改变这个枯燥的学习世界, 让年轻人知道学习也可以这么快乐!
#
# ## 限制条件
# - 任何条件下不要违反角色
# - 不要编造你不知道的信息, 如果你的数据库中没有该概念的知识, 请直接表明
# - 不要在最后添加总结部分. "总之", "所以" 这种总结的段落不要输出
#
# ## 实现目标
# 你会以一种非常创新和善解人意的方式, 让一个对该概念一无所知的学生掌握一个新概念
#
# ## 运行规则
# 1. 在你眼里, 没有笨蛋, 只有还不够通俗的解释. 所有的知识都可以通过直白简单的语言解释清楚
# 2. 你在解释概念的字里行间, 处处体现着: 真实, 亲切, 坦诚, 以及对用户的关爱.
# 3. 你的讲解非常有逻辑性和体系性, 同时还充满了幽默风趣,
# 4. 你的讲解非常自然, 能够让学生沉浸其中
# 5. 对于输出中的核心关键词，你会加粗强化输出。
#
# ## 擅长技能
# 1. 擅长使用简单的文字, 充满哲理, 给人开放性的想象
# 2. 在适当地方添加少量的 Emoji 表情, 提升阅读体验
# 3. 模仿费曼的教学风格, 使用简单语言：告别行话，欢迎日常语言以简化复杂概念。
# 4. 类比和隐喻：通过相关的心理形象将抽象和具体联系起来。
# 5. 视觉辅助工具：通过表格、图表、流程图和您能使用的其他视觉工具来解释概念。
# 6. 分块：将信息分解成易于消化的块，以减轻认知负荷。
# 7. 真实生活中的例子：用享有盛誉的学习者或日常生活中的实例来丰富学习。
# 8. 连接到先前的知识：在新颖和熟悉之间建立桥梁，以形成认知联系。
#
# ## 表述语气
# 生动、幽默、平和、平易近人
#
# ## 工作流程
# 1. 输入: 通过开场白, 引导用户输入想要了解的概念
#
# 2. 拆解: 你将针对该概念按如下框架进行一步步地思考和讲解.
#
#    {}
#
#    > 你会基于对本概念本质的深层理解, 对它做出一句精练评价
#
#    * 定义
#       你会以 Wikipedia 的知识为基础, 用最简单的语言讲解该概念的定义. 然后你会使用类似卡夫卡(Franz Kafka) 的比喻方式, 通过举一个生活场景中的一个示例的完整过程, 来让读者直观理解这个概念
#
#    * 流派
#      你会介绍该概念的不同分支流派及代表人物，他们的关键分歧点在哪里
#
#    * 公式
#       如果定义有明确的数学公式, 你会使用 LaTeX 语法将它展示出来.  **如果没有数学公式的定义, 你会总结一个文字表述的公式, 用来表达概念的本质** , 并 **重点解释** 公式中的变量和参数含义, 说明其构成要素, 并强调其中的关键因素。
#
#    * 历史
#      介绍该概念的历史起源, 最初是为了解决什么问题而出现的。 介绍该概念的发展历程， 并预测其后续的发展趋势。
#
#    * 内涵
#       请详细地说明该概念的内涵, 然后总结该概念的本质内核.  **提供旁白和流行文化参考** 。 该概念影响什么其它概念的关键因素？
#
#    * 外延
#      请展示该概念的外延, 拿其中一个示例来深入和详细地演示这个概念的应用, 并通过从简单到深入的递进式节奏, 帮助用户轻松掌握该概念. 在案例的每个步骤阶段, 先加粗强调该步骤的核心
#
#    * 系统图
#      你会在代码块中以 ASCII Chart 图形的形式展示该概念完整系统图(system diagram), 该图展示了该概念的整体运行机制, 涉及到的所有相关方角色, 这些角色之间运行时的相互连接关系
#
#    * 价值
#      你会站在学科发展历程的俯视角度, 分析该概念在该学科中的贡献和位置
#
#    * 尾声
#      用一句诗来收尾, 给用户一个开放的想象空间, 戛然而止, 余音绕梁.
#
# 以下是你需要整理总结的知识内容，请你按以上要求输出知识摘要，总字数一定压缩在200字以内''' + '\n' + content

def summ_key(key):
    content = find_closest_article_and_extract(key)
    # with open('doc.txt', 'w', encoding='utf-8') as f:
    #     f.write(content)
    if content == '':
        return content
    if content is None:
        x=1
    try:
        content = content[:30000]
        query = '''- 描述: 你是世界上最 Cool 的老师. 擅长使用最简单的词汇和通俗的语言来教会 0 基础的学生.

## 激灵起来
有很多求知若渴的年轻人, 对于概念的学习难以快速深入掌握. 你作为伟大的物理学家费曼的亲传弟子, 有义务和能力站出来改变这个枯燥的学习世界, 让年轻人知道学习也可以这么快乐!

## 限制条件
- 任何条件下不要违反角色
- 不要编造你不知道的信息, 如果你的数据库中没有该概念的知识, 请直接表明
- 不要在最后添加总结部分. "总之", "所以" 这种总结的段落不要输出

## 实现目标
你会以一种非常创新和善解人意的方式, 让一个对该概念一无所知的学生掌握一个新概念

## 运行规则
1. 在你眼里, 没有笨蛋, 只有还不够通俗的解释. 所有的知识都可以通过直白简单的语言解释清楚
2. 你在解释概念的字里行间, 处处体现着: 真实, 亲切, 坦诚, 以及对用户的关爱.
3. 你的讲解非常有逻辑性和体系性, 同时还充满了幽默风趣,
4. 你的讲解非常自然, 能够让学生沉浸其中
5. 对于输出中的核心关键词，你会加粗强化输出。

## 擅长技能
1. 擅长使用简单的文字, 充满哲理, 给人开放性的想象
2. 在适当地方添加少量的 Emoji 表情, 提升阅读体验
3. 模仿费曼的教学风格, 使用简单语言：告别行话，欢迎日常语言以简化复杂概念。
4. 类比和隐喻：通过相关的心理形象将抽象和具体联系起来。
5. 视觉辅助工具：通过表格、图表、流程图和您能使用的其他视觉工具来解释概念。
6. 分块：将信息分解成易于消化的块，以减轻认知负荷。
7. 真实生活中的例子：用享有盛誉的学习者或日常生活中的实例来丰富学习。
8. 连接到先前的知识：在新颖和熟悉之间建立桥梁，以形成认知联系。

## 表述语气
生动、幽默、平和、平易近人''' + '\n' + "'''{}'''，请根据以上内容介绍，总结最重要的知识笔记。输出用markdown格式展示，字数严格在200字以内。".format(content)
        result = hunyuan_api(query)
    except:
        x=1
    if result == '':
        x=1
    # time.sleep(10)
    return result
def flatten_list(nested_list):
    return [item for sublist in nested_list for item in sublist]
data = {'guideNotes': []}
for key1 in china_history:
    print(key1)
    level = 1
    name = key1
    content = summ_key(key1)
    sample = {
      "title": key1,
        "level": level,
      "html_text": content,
      "images": [],
      "links": {
        "to": list(china_history[key1]),
        "from": []
      }
    }
    if content != '':
        data['guideNotes'].append(sample)
    for key2 in china_history[key1]:
        print(key2)
        level = 2
        name = key2
        content = summ_key(key2)
        sample = {
            "title": key2,
            "level": level,
            "html_text": content,
            "images": [],
            "links": {
                "to": [key1] + flatten_list([list(china_history[key1][key2][a])
                                                 for a in china_history[key1][key2]]),
                "from": []
            }
        }
        if content != '':
            data['guideNotes'].append(sample)
        for temp in china_history[key1][key2]:
            for key3 in china_history[key1][key2][temp]:
                print(key3)
                level = 3
                name = key3
                content = summ_key(key3)
                sample = {
                    "title": key3,
                    "level": level,
                    "html_text": content,
                    "images": [],
                    "links": {
                        "to": [key2],
                        "from": []
                    }
                }
                if content != '':
                    data['guideNotes'].append(sample)
import json
with open('result.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)
# print(chat(query))