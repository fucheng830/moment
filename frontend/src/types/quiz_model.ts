

/*
# Quiz 模型说明文档
## 概述
Quiz 模型用于表示各种类型的测验题目。每个 Quiz 对象包含题目的基本信息、题型、选项和答案等。
## 属性说明
- id: string | null - quiz 的唯一标识符。新建的 quiz 时为 null。
- difficulty: number - 题目难度，由算法更新，初始难度为 0。
- question: string - 题目正文，必填项。
- quiz_type: QuizType | null - 题目类型，必填项。
- answers: string[] | null - 用于存储 QA、FIB 和 TOF 类型题目的答案。
- options: string[] | null - 用于存储正确选项或排序选项。
- options_: string[] | null - 用于存储干扰选项或配对选项。
- tips: string | null - 题目提示。
- analysis: string | null - 题目解析。
- created_at: string | null - 创建时间。
## 题型说明
1. QA（问答题）：
   - answers: 包含一个字符串，表示答案。
   - options 和 options_: 不使用。
2. CQ（单选题）：
   - options: 包含一个字符串，表示正确选项。
   - options_: 干扰选项。
   - answers: 不使用。
3. MCQ（多选题）：
   - options: 包含多个字符串，表示所有正确选项。
   - options_: 干扰选项。
   - answers: 不使用。
4. TOF（判断题）：
   - answers: 包含一个字符串，只能是 'T' 或 'F'。
   - options 和 options_: 不使用。
5. FIB（填空题）：
   - answers: 包含多个字符串，每个字符串对应一个空。
   - options 和 options_: 不使用。
   - question: 使用 _[1]_、_[2]_ 等表示填空位置。
6. MAT（配对题）：
   - options: 包含第一组选项。
   - options_: 包含第二组选项，与 options 一一对应。
   - answers: 不使用。
7. OD（排序题）：
   - options: 包含需要排序的所有选项。
   - options_ 和 answers: 不使用。
## 验证
使用 isValidQuiz 函数验证 Quiz 对象的有效性。此函数会根据不同的题型检查必要字段是否正确填写。
*/


/*
xml格式的示例（用于AI解析）

<QUESTION>什么是光合作用？</QUESTION>
<QUIZTYPE>QA</QUIZTYPE>
<ANSWERS>光合作用是植物利用阳光、二氧化碳和水生成葡萄糖和氧气的过程。</ANSWERS>
<HINT>考虑植物如何获取能量和养分。</HINT>
<ANALYSIS>光合作用是植物、藻类和某些细菌进行的一种重要生理过程。它将光能转化为化学能，并将无机物转化为有机物，为地球上的生命提供了能量和氧气。</ANALYSIS>


<QUESTION>地球上最大的洋是？</QUESTION>
<QUIZTYPE>CQ</QUIZTYPE>
<OPTION>太平洋</OPTION>
<OPTION_>大西洋</OPTION_>
<OPTION_>印度洋</OPTION_>
<OPTION_>北冰洋</OPTION_>
<HINT>考虑各大洋的面积大小。</HINT>
<ANALYSIS>太平洋是地球上最大的海洋，占据了地球表面积的约30%，面积约为1.65亿平方公里。</ANALYSIS>


<QUESTION>以下哪些是常见的编程语言？</QUESTION>
<QUIZTYPE>MCQ</QUIZTYPE>
<OPTION>Python</OPTION>
<OPTION>Java</OPTION>
<OPTION>JavaScript</OPTION>
<OPTION_>HTML</OPTION_>
<HINT>考虑哪些是用于编写程序逻辑的语言。</HINT>
<ANALYSIS>Python、Java和JavaScript都是常见的编程语言，用于编写程序逻辑。HTML是标记语言，主要用于构建网页结构，不属于编程语言。</ANALYSIS>
<QUESTION>什么是光合作用？</QUESTION>
<QUIZTYPE>QA</QUIZTYPE>
<ANSWERS>光合作用是植物利用阳光、二氧化碳和水生成葡萄糖和氧气的过程。</ANSWERS>
<HINT>考虑植物如何获取能量和养分。</HINT>
<ANALYSIS>光合作用是植物、藻类和某些细菌进行的一种重要生理过程。它将光能转化为化学能，并将无机物转化为有机物，为地球上的生命提供了能量和氧气。</ANALYSIS>


<QUESTION>水的化学式是H2O。</QUESTION>
<QUIZTYPE>TOF</QUIZTYPE>
<ANSWERS>T</ANSWERS>
<HINT>回想水分子的组成。</HINT>
<ANALYSIS>这个陈述是正确的。水的化学式确实是H2O，表示每个水分子由两个氢原子和一个氧原子组成。</ANALYSIS>
<QUESTION>太阳系中最大的行星是_[1]，最小的行星是[2]_。</QUESTION>
<QUIZTYPE>FIB</QUIZTYPE>
<ANSWERS>木星</ANSWERS>
<ANSWERS>水星</ANSWERS>
<HINT>考虑太阳系中行星的大小排序。</HINT>
<ANALYSIS>木星是太阳系中最大的行星，直径约为142,984公里。水星是太阳系中最小的行星，直径仅为4,879公里。</ANALYSIS>


<QUESTION>请将以下国家与其首都匹配。</QUESTION>
<QUIZTYPE>MAT</QUIZTYPE>
<OPTION>中国</OPTION>
<OPTION>美国</OPTION>
<OPTION>日本</OPTION>
<OPTION_>北京</OPTION_>
<OPTION_>华盛顿特区</OPTION_>
<OPTION_>东京</OPTION_>
<HINT>回想每个国家的政治中心。</HINT>
<ANALYSIS>中国的首都是北京，美国的首都是华盛顿特区，日本的首都是东京。这些城市都是各自国家的政治、经济和文化中心。</ANALYSIS>


<QUESTION>请将以下历史事件按时间先后顺序排列。</QUESTION>
<QUIZTYPE>OD</QUIZTYPE>
<OPTION>第一次世界大战</OPTION>
<OPTION>第二次世界大战</OPTION>
<OPTION>冷战</OPTION>
<OPTION>柏林墙倒塌</OPTION>
<HINT>考虑20世纪重大历史事件的发生顺序。</HINT>
<ANALYSIS>正确的时间顺序是：第一次世界大战（1914-1918）、第二次世界大战（1939-1945）、冷战（约1947-1991）、柏林墙倒塌（1989）。这些事件标志着20世纪的重要历史转折点。</ANALYSIS>
*/