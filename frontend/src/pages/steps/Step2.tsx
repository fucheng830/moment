import React, { useState, useMemo } from 'react';
import { useGuide } from '../GuidePage';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotesContext } from '@/context/NotesContext';
import { Loader2 } from "lucide-react";


interface Tag {
    id: string;
    name: string;
    description: string;
}

interface CategoryTags {
    [key: string]: Tag[];
}

const Step2: React.FC = () => {
    const { setCurrentStepIndex } = useGuide();
    const { selectedCategoryId } = useNotesContext();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const categoryTags: CategoryTags = {
        'ai': [
            { id: 'machine-learning', name: '机器学习', description: '算法、模型训练与评估' },
            { id: 'deep-learning', name: '深度学习', description: '神经网络、框架应用' },
            { id: 'nlp', name: '自然语言处理', description: '文本分析、语言模型' },
            { id: 'computer-vision', name: '计算机视觉', description: '图像识别、目标检测' },
            { id: 'reinforcement-learning', name: '强化学习', description: '决策学习、智能代理' },
            { id: 'ai-ethics', name: 'AI伦理', description: '道德准则、社会影响' },
            { id: 'robotics', name: '机器人技术', description: '自动控制、机器人应用' },
            { id: 'expert-systems', name: '专家系统', description: '知识表示、推理系统' },
            { id: 'generative-ai', name: '生成式AI', description: 'GAN、文本生成' },
            { id: 'ai-optimization', name: 'AI优化', description: '性能优化、资源管理' },
            { id: 'speech-recognition', name: '语音识别', description: '语音处理、声音分析' },
            { id: 'ai-algorithms', name: 'AI算法', description: '基础算法、复杂度分析' },
            { id: 'neural-networks', name: '神经网络', description: '网络结构、训练方法' },
            { id: 'data-mining', name: '数据挖掘', description: '模式识别、知识发现' },
            { id: 'ai-applications', name: 'AI应用', description: '实际应用案例研究' },
            { id: 'ai-frameworks', name: 'AI框架', description: '主流框架使用方法' },
            { id: 'ai-research', name: 'AI研究', description: '前沿研究、学术进展' },
            { id: 'ai-systems', name: 'AI系统', description: '系统架构、部署方案' },
            { id: 'ai-tools', name: 'AI工具', description: '开发工具、测试方法' },
            { id: 'ai-future', name: 'AI未来', description: '发展趋势、未来展望' }
        ],
        'math': [
            { id: 'calculus', name: '微积分', description: '极限、导数、积分' },
            { id: 'linear-algebra', name: '线性代数', description: '矩阵、向量空间' },
            { id: 'probability', name: '概率论', description: '随机变量、概率分布' },
            { id: 'statistics', name: '统计学', description: '数据分析、统计推断' },
            { id: 'discrete-math', name: '离散数学', description: '集合论、图论' },
            { id: 'number-theory', name: '数论', description: '整数性质、同余' },
            { id: 'abstract-algebra', name: '抽象代数', description: '群论、环论' },
            { id: 'geometry', name: '几何', description: '欧氏几何、解析几何' },
            { id: 'topology', name: '拓扑学', description: '连续变换、同胚' },
            { id: 'optimization', name: '最优化', description: '线性规划、凸优化' },
            { id: 'mathematical-analysis', name: '数学分析', description: '函数论、级数' },
            { id: 'differential-equations', name: '微分方程', description: '常微分、偏微分' },
            { id: 'complex-analysis', name: '复分析', description: '复变函数、解析性' },
            { id: 'numerical-methods', name: '数值方法', description: '数值计算、误差分析' },
            { id: 'graph-theory', name: '图论', description: '图的性质、应用' },
            { id: 'logic', name: '数理逻辑', description: '命题逻辑、谓词逻辑' },
            { id: 'set-theory', name: '集合论', description: '集合运算、基数理论' },
            { id: 'cryptography', name: '密码学', description: '加密算法、安全性' },
            { id: 'real-analysis', name: '实分析', description: '实数系统、度量空间' },
            { id: 'mathematical-modeling', name: '数学建模', description: '建模方法、应用实践' }
        ],
        'programming': [
            { id: 'python', name: 'Python', description: '基础语法、高级特性' },
            { id: 'javascript', name: 'JavaScript', description: '前端开发、框架应用' },
            { id: 'java', name: 'Java', description: '面向对象、企业应用' },
            { id: 'cpp', name: 'C++', description: '系统编程、性能优化' },
            { id: 'algorithms', name: '算法', description: '数据结构、算法设计' },
            { id: 'web-dev', name: 'Web开发', description: '前端技术、后端开发' },
            { id: 'mobile-dev', name: '移动开发', description: 'iOS、Android开发' },
            { id: 'database', name: '数据库', description: 'SQL、数据库设计' },
            { id: 'devops', name: 'DevOps', description: '持续集成、部署自动化' },
            { id: 'security', name: '安全', description: '网络安全、加密技术' },
            { id: 'cloud', name: '云计算', description: '云服务、架构设计' },
            { id: 'testing', name: '测试', description: '单元测试、自动化测试' },
            { id: 'frameworks', name: '框架', description: '主流框架使用' },
            { id: 'architecture', name: '架构', description: '系统设计、架构模式' },
            { id: 'functional', name: '函数式编程', description: '函数式范式' },
            { id: 'concurrent', name: '并发编程', description: '多线程、异步编程' },
            { id: 'design-patterns', name: '设计模式', description: '常用设计模式' },
            { id: 'code-quality', name: '代码质量', description: '重构、最佳实践' },
            { id: 'tools', name: '开发工具', description: 'IDE、版本控制' },
            { id: 'api-design', name: 'API设计', description: 'RESTful、接口设计' }
        ],
        'science': [
            { id: 'physics-mechanics', name: '力学', description: '运动学、动力学基础' },
            { id: 'physics-em', name: '电磁学', description: '电场、磁场、电磁波' },
            { id: 'thermodynamics', name: '热力学', description: '热学基础、能量转换' },
            { id: 'quantum-physics', name: '量子物理', description: '量子力学基础' },
            { id: 'organic-chemistry', name: '有机化学', description: '有机物结构与反应' },
            { id: 'inorganic-chemistry', name: '无机化学', description: '元素性质与反应' },
            { id: 'analytical-chemistry', name: '分析化学', description: '化学分析方法' },
            { id: 'biochemistry', name: '生物化学', description: '生命化学过程' },
            { id: 'molecular-biology', name: '分子生物学', description: 'DNA与蛋白质' },
            { id: 'cell-biology', name: '细胞生物学', description: '细胞结构与功能' },
            { id: 'genetics', name: '遗传学', description: '遗传规律与变异' },
            { id: 'ecology', name: '生态学', description: '生态系统与环境' },
            { id: 'astronomy', name: '天文学', description: '宇宙结构与演化' },
            { id: 'geology', name: '地质学', description: '地球科学基础' },
            { id: 'environmental-science', name: '环境科学', description: '环境保护与治理' },
            { id: 'materials-science', name: '材料科学', description: '材料性质与应用' },
            { id: 'scientific-method', name: '科学方法', description: '实验设计与验证' },
            { id: 'biophysics', name: '生物物理', description: '生物系统物理学' },
            { id: 'neuroscience', name: '神经科学', description: '神经系统研究' },
            { id: 'scientific-instruments', name: '科学仪器', description: '实验仪器使用' }
        ],
        'language': [
            { id: 'english-grammar', name: '英语语法', description: '语法规则与应用' },
            { id: 'english-speaking', name: '英语口语', description: '口语表达与交流' },
            { id: 'english-writing', name: '英语写作', description: '写作技巧与练习' },
            { id: 'english-reading', name: '英语阅读', description: '阅读理解与技巧' },
            { id: 'business-english', name: '商务英语', description: '职场英语应用' },
            { id: 'japanese-basic', name: '日语基础', description: '假名与基础语法' },
            { id: 'japanese-conversation', name: '日语会话', description: '日常对话练习' },
            { id: 'japanese-kanji', name: '日语汉字', description: '汉字学习与应用' },
            { id: 'mandarin-phonetics', name: '普通话语音', description: '发音与声调' },
            { id: 'mandarin-grammar', name: '汉语语法', description: '语法结构分析' },
            { id: 'french-basic', name: '法语基础', description: '基础语法与发音' },
            { id: 'german-basic', name: '德语基础', description: '基础语法与词汇' },
            { id: 'spanish-basic', name: '西班牙语基础', description: '入门语法与会话' },
            { id: 'korean-basic', name: '韩语基础', description: '谚文与基础会话' },
            { id: 'translation', name: '翻译技巧', description: '翻译理论与实践' },
            { id: 'interpretation', name: '口译技巧', description: '口译方法与训练' },
            { id: 'linguistics', name: '语言学', description: '语言学基础理论' },
            { id: 'phonetics', name: '语音学', description: '语音分析与训练' },
            { id: 'cross-cultural', name: '跨文化交际', description: '文化差异理解' },
            { id: 'language-acquisition', name: '语言习得', description: '语言学习方法' }
        ],
        'art': [
            { id: 'drawing-basics', name: '素描基础', description: '线条、明暗、构图' },
            { id: 'color-theory', name: '色彩理论', description: '色彩搭配与应用' },
            { id: 'oil-painting', name: '油画', description: '油画技法与创作' },
            { id: 'watercolor', name: '水彩', description: '水彩画技法与表现' },
            { id: 'digital-painting', name: '数字绘画', description: '电脑绘画技术' },
            { id: 'sculpture', name: '雕塑', description: '立体造型艺术' },
            { id: 'photography', name: '摄影', description: '摄影技术与美学' },
            { id: 'graphic-design', name: '平面设计', description: '版式与视觉设计' },
            { id: 'ui-design', name: 'UI设计', description: '界面设计原则' },
            { id: 'animation', name: '动画', description: '动画制作技术' },
            { id: 'art-history', name: '艺术史', description: '艺术发展与流派' },
            { id: 'music-theory', name: '音乐理论', description: '乐理基础知识' },
            { id: 'piano', name: '钢琴', description: '钢琴演奏技巧' },
            { id: 'guitar', name: '吉他', description: '吉他弹奏方法' },
            { id: 'vocal-music', name: '声乐', description: '唱歌技巧训练' },
            { id: 'composition', name: '作曲', description: '音乐创作方法' },
            { id: 'film-making', name: '电影制作', description: '影视制作流程' },
            { id: 'theater', name: '戏剧表演', description: '表演技巧训练' },
            { id: 'dance', name: '舞蹈', description: '舞蹈基本功训练' },
            { id: 'creative-writing', name: '创意写作', description: '文学创作技巧' }
        ],
        'economics': [
            { id: 'microeconomics', name: '微观经济学', description: '个体经济行为分析' },
            { id: 'macroeconomics', name: '宏观经济学', description: '整体经济现象研究' },
            { id: 'finance', name: '金融学', description: '金融市场与工具' },
            { id: 'investment', name: '投资学', description: '投资理论与实践' },
            { id: 'banking', name: '银行学', description: '银行业务与管理' },
            { id: 'stock-market', name: '股票市场', description: '股票交易与分析' },
            { id: 'international-trade', name: '国际贸易', description: '贸易理论与实务' },
            { id: 'monetary-policy', name: '货币政策', description: '货币理论与政策' },
            { id: 'public-economics', name: '公共经济学', description: '政府经济行为' },
            { id: 'development-economics', name: '发展经济学', description: '经济发展理论' },
            { id: 'behavioral-economics', name: '行为经济学', description: '经济行为心理' },
            { id: 'econometrics', name: '计量经济学', description: '经济数据分析' },
            { id: 'risk-management', name: '风险管理', description: '金融风险控制' },
            { id: 'corporate-finance', name: '公司金融', description: '企业财务管理' },
            { id: 'derivatives', name: '金融衍生品', description: '期货期权交易' },
            { id: 'taxation', name: '税收理论', description: '税收制度研究' },
            { id: 'market-analysis', name: '市场分析', description: '市场研究方法' },
            { id: 'economic-policy', name: '经济政策', description: '政策制定与影响' },
            { id: 'financial-markets', name: '金融市场', description: '市场结构与功能' },
            { id: 'international-finance', name: '国际金融', description: '国际金融体系' }
        ],
        'history': [
            { id: 'ancient-civilizations', name: '古代文明', description: '早期人类文明' },
            { id: 'medieval-history', name: '中世纪史', description: '中世纪时期研究' },
            { id: 'modern-history', name: '现代史', description: '近现代历史发展' },
            { id: 'chinese-history', name: '中国历史', description: '中国历史发展' },
            { id: 'world-war', name: '世界大战', description: '两次世界大战研究' },
            { id: 'american-history', name: '美国历史', description: '美国发展历程' },
            { id: 'european-history', name: '欧洲历史', description: '欧洲历史发展' },
            { id: 'asian-history', name: '亚洲历史', description: '亚洲历史研究' },
            { id: 'cultural-history', name: '文化史', description: '文化发展历程' },
            { id: 'economic-history', name: '经济史', description: '经济发展历史' },
            { id: 'military-history', name: '军事史', description: '战争与军事发展' },
            { id: 'art-history', name: '艺术史', description: '艺术发展历程' },
            { id: 'scientific-history', name: '科技史', description: '科技发展历史' },
            { id: 'political-history', name: '政治史', description: '政治制度演变' },
            { id: 'social-history', name: '社会史', description: '社会变迁研究' },
            { id: 'archaeological', name: '考古学', description: '考古发现与研究' },
            { id: 'historiography', name: '史学方法', description: '历史研究方法' },
            { id: 'religious-history', name: '宗教史', description: '宗教发展历史' },
            { id: 'intellectual-history', name: '思想史', description: '思想发展历程' },
            { id: 'historical-geography', name: '历史地理', description: '地理环境变迁' }
        ],
        'computerScience': [
            { id: 'data-structures', name: '数据结构', description: '基本数据结构' },
            { id: 'algorithms', name: '算法', description: '算法设计与分析' },
            { id: 'operating-systems', name: '操作系统', description: '系统原理与设计' },
            { id: 'computer-networks', name: '计算机网络', description: '网络协议与应用' },
            { id: 'database-systems', name: '数据库系统', description: '数据库理论与实现' },
            { id: 'computer-architecture', name: '计算机体系结构', description: '硬件设计原理' },
            { id: 'software-engineering', name: '软件工程', description: '软件开发方法' },
            { id: 'artificial-intelligence', name: '人工智能', description: 'AI基础理论' },
            { id: 'machine-learning', name: '机器学习', description: '学习算法与应用' },
            { id: 'computer-security', name: '计算机安全', description: '安全防护技术' },
            { id: 'distributed-systems', name: '分布式系统', description: '分布式计算原理' },
            { id: 'cloud-computing', name: '云计算', description: '云服务与架构' },
            { id: 'big-data', name: '大数据', description: '大数据处理技术' },
            { id: 'compiler-design', name: '编译原理', description: '编译器设计' },
            { id: 'computer-graphics', name: '计算机图形学', description: '图形渲染技术' },
            { id: 'parallel-computing', name: '并行计算', description: '并行处理技术' },
            { id: 'embedded-systems', name: '嵌入式系统', description: '嵌入式开发' },
            { id: 'formal-methods', name: '形式化方法', description: '软件验证技术' },
            { id: 'human-computer-interaction', name: '人机交互', description: '交互设计原理' },
            { id: 'quantum-computing', name: '量子计算', description: '量子计算基础' }
        ],
        // 补充完整的心理学标签
        'psychology': [
            { id: 'cognitive-psychology', name: '认知心理学', description: '认知过程研究' },
            { id: 'developmental-psychology', name: '发展心理学', description: '心理发展规律' },
            { id: 'social-psychology', name: '社会心理学', description: '群体行为研究' },
            { id: 'abnormal-psychology', name: '异常心理学', description: '心理障碍研究' },
            { id: 'personality-psychology', name: '人格心理学', description: '人格特质研究' },
            { id: 'educational-psychology', name: '教育心理学', description: '学习心理研究' },
            { id: 'clinical-psychology', name: '临床心理学', description: '心理诊断治疗' },
            { id: 'behavioral-psychology', name: '行为心理学', description: '行为规律研究' },
            { id: 'positive-psychology', name: '积极心理学', description: '心理健康促进' },
            { id: 'sports-psychology', name: '运动心理学', description: '运动表现优化' },
            { id: 'counseling-psychology', name: '咨询心理学', description: '心理咨询技术' },
            { id: 'neuropsychology', name: '神经心理学', description: '脑与行为关系' },
            { id: 'industrial-psychology', name: '工业心理学', description: '职场行为研究' },
            { id: 'health-psychology', name: '健康心理学', description: '身心健康关系' },
            { id: 'forensic-psychology', name: '法律心理学', description: '法律行为研究' },
            { id: 'cross-cultural-psychology', name: '跨文化心理学', description: '文化差异研究' },
            { id: 'environmental-psychology', name: '环境心理学', description: '环境影响研究' },
            { id: 'evolutionary-psychology', name: '进化心理学', description: '心理进化研究' },
            { id: 'experimental-psychology', name: '实验心理学', description: '心理实验方法' },
            { id: 'psychometrics', name: '心理测量学', description: '心理测量技术' }
        ]
    };


    const availableTags = useMemo(() => {
        return selectedCategoryId ? categoryTags[selectedCategoryId] || [] : [];
    }, [selectedCategoryId]);

    const handleTagClick = (tagId: string) => {
        setSelectedTags(prev => {
            if (prev.includes(tagId)) {
                return prev.filter(id => id !== tagId);
            }
            if (prev.length >= 4) {
                return prev;
            }
            return [...prev, tagId];
        });
    };


    const handleContinue = async () => {
        if (selectedTags.length > 0) {
            setIsLoading(true);
            try {
                // 模拟数据准备过程
                await new Promise(resolve => setTimeout(resolve, 3000));
                setCurrentStepIndex(prev => prev + 1);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-68px)] mx-auto gap-6 w-full">
            <div className="flex flex-col items-center space-y-2 pt-6 h-[100px]">
                <h1 className="text-2xl font-bold">
                    选择你感兴趣的主题
                </h1>
                <p className="text-gray-600">
                    (最多选择4个主题)
                </p>
            </div>

            <ScrollArea className="flex-1 min-h-0 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
                    {availableTags.map((tag) => (
                        <div key={tag.id}>
                            <div
                                className={`p-4 rounded-lg cursor-pointer 
                                    transition-all duration-200 ease-out
                                    ${selectedTags.includes(tag.id)
                                        ? 'border-2 border-blue-500 bg-blue-50'
                                        : selectedTags.length >= 4
                                            ? 'border border-gray-200 opacity-50 cursor-not-allowed'
                                            : 'border border-gray-200 hover:border-blue-300'
                                    }`}
                                onClick={() => handleTagClick(tag.id)}
                            >
                                <h3 className="text-lg font-semibold mb-1">{tag.name}</h3>
                                <p className="text-sm text-gray-600">{tag.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="flex justify-center h-[80px] items-center">
                <button
                    className={`px-8 py-3 rounded-full font-semibold border-2 
                        transition-all duration-200 ease-out
                        ${selectedTags.length > 0
                            ? 'border-blue-500 text-blue-500 hover:bg-blue-50'
                            : 'border-gray-300 text-gray-400'
                        }`}
                    onClick={handleContinue}
                    disabled={selectedTags.length === 0 || isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            正在准备数据...
                        </div>
                    ) : (
                        '继续'
                    )}
                </button>
            </div>
        </div>
    );
}

export default Step2;