from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field
import langchain_core
from langchain.output_parsers import OutputFixingParser

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import logging

model_name = 'glm-4-plus'

class Quiz(BaseModel):
    difficulty: int = Field(default=0, description="quiz的难度，由算法更新，初始难度为0")
    question: str = Field(..., description="必要字段")
    quiz_type: Optional[str] = Field(default=None, description="题目类型")
    answers: Optional[List[str]] = Field(default=None, description="答案，在QA,FIB,TOF中使用")
    options: Optional[List[str]] = Field(default=None, description="正确选项，在MCQ，CQ，OD中使用")
    options_: Optional[List[str]] = Field(default=None, description="干扰选项,在MCQ，CQ，OD中使用表示干扰选项,在MAT中则表示和options一一对应的配对选项")
    tips: Optional[str] = Field(default=None, description="提示信息")
    analysis: Optional[str] = Field(default=None, description="分析")


class QUizList(BaseModel):
    quiz_list: List[Quiz] = Field(..., description="quiz列表")


# 初始化解析器，使用PydanticOutputParser
parser = PydanticOutputParser(pydantic_object=QUizList)

def generate_questions(text: str) -> dict:
    # 初始化一个模板
    sub_task_prompt = "你是一个出题大师，你需要根据用户给出的笔记文档出题：\n{text}\n{format_instructions}"

    prompt = PromptTemplate(
        template=sub_task_prompt,
        input_variables=["text"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )
    
    # 初始化大语言模型
    llm = ChatOpenAI(model=model_name, timeout=3600, max_retries=5, temperature=0.2)

    try:
        # 创建链并调用模型
        think_chain = prompt | llm
        sub_task = think_chain.invoke({"text": text})
        
        # 解析模型返回的内容
        parsed_obj = parser.parse(sub_task.content)
        result = parsed_obj.dict()
        return result

    except langchain_core.exceptions.OutputParserException as e:
        n = 0
        while n < 3:
            n += 1
            try:
                logging.error(f"Failed to parse output from sub task. Error: {e}")
                
                # 尝试使用 OutputFixingParser 修复输出
                new_parser = langchain_core.parsers.OutputFixingParser.from_llm(parser=parser, llm=llm)
                parsed_obj = new_parser.parse(sub_task.content)
                return parsed_obj.dict()
            except Exception as retry_exception:
                logging.error(f"Retrying failed attempts: {retry_exception}")
                pass
    except Exception as e:
        logging.error(f"Failed to parse json", exc_info=True)
        return None
    
# 接口
from fastapi import APIRouter 
router = APIRouter()

class InputData(BaseModel):
    text: str


@router.post('/generate_questions')
def _generate_questions(data: InputData):
    """生成题目"""
    result = generate_questions(data.text)
    return result

    
if __name__ == "__main__":
    import os 
    text = """## 数据结构：数组

数组是最基础的数据结构，特点：

-   {{连续的内存空间}}
-   {{固定的大小}}
-   {{通过索引访问}}

优点：

-   随机访问效率高
-   空间利用率高

参考：[[数据结构：链表]]

#数据结构 #数组 #编程基础"""
    result = generate_questions(text)
    print(result)