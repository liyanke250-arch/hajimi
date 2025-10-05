-- ==========================================
-- Hajimi GRE 题库数据库初始化 SQL
-- 创建时间: 2025-10-05
-- 用途: 在 Supabase SQL Editor 中执行
-- ==========================================

-- 创建题目表
CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    uuid TEXT UNIQUE NOT NULL,
    source_id TEXT NOT NULL,
    version DOUBLE PRECISION DEFAULT 1.0,
    question_text TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    difficulty_level TEXT NOT NULL,
    difficulty_score DOUBLE PRECISION NOT NULL,
    sentence_complexity TEXT NOT NULL,
    vocab_rarity TEXT NOT NULL,
    logic_subtlety TEXT NOT NULL,
    analysis JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建选项表
CREATE TABLE IF NOT EXISTS question_options (
    id TEXT PRIMARY KEY,
    question_id TEXT NOT NULL,
    choice TEXT NOT NULL,
    text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    analysis_text TEXT,
    trap_types TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(question_id, choice),
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- 创建词汇表
CREATE TABLE IF NOT EXISTS vocabularies (
    id TEXT PRIMARY KEY,
    uuid TEXT UNIQUE NOT NULL,
    word TEXT UNIQUE NOT NULL,
    version DOUBLE PRECISION DEFAULT 1.0,
    phonetic TEXT,
    definition_cn TEXT NOT NULL,
    etymology JSONB,
    cognates JSONB,
    example_sentence TEXT,
    example_translation TEXT,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建题目-词汇关联表
CREATE TABLE IF NOT EXISTS question_vocabularies (
    id TEXT PRIMARY KEY,
    question_id TEXT NOT NULL,
    vocabulary_id TEXT NOT NULL,
    role TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(question_id, vocabulary_id),
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (vocabulary_id) REFERENCES vocabularies(id) ON DELETE CASCADE
);

-- 创建索引（提高查询性能）
CREATE INDEX IF NOT EXISTS idx_questions_uuid ON questions(uuid);
CREATE INDEX IF NOT EXISTS idx_questions_source_id ON questions(source_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_vocabularies_word ON vocabularies(word);
CREATE INDEX IF NOT EXISTS idx_qv_question_id ON question_vocabularies(question_id);
CREATE INDEX IF NOT EXISTS idx_qv_vocabulary_id ON question_vocabularies(vocabulary_id);

-- 创建扩展表（可选）
CREATE TABLE IF NOT EXISTS logic_types (
    id TEXT PRIMARY KEY,
    official_tag TEXT UNIQUE NOT NULL,
    name_cn TEXT NOT NULL,
    description TEXT,
    question_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trap_types (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name_cn TEXT NOT NULL,
    description TEXT,
    occurrence_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS word_relations (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    concept_cn TEXT NOT NULL,
    word1 TEXT NOT NULL,
    word2 TEXT NOT NULL,
    source_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_word_relations_type ON word_relations(type);
CREATE INDEX IF NOT EXISTS idx_word_relations_word1 ON word_relations(word1);
CREATE INDEX IF NOT EXISTS idx_word_relations_word2 ON word_relations(word2);

-- 创建用户表（预留）
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    target_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_practices (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    question_id TEXT NOT NULL,
    user_answer TEXT,
    is_correct BOOLEAN NOT NULL,
    time_spent INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_practices_user_id ON user_practices(user_id);
CREATE INDEX IF NOT EXISTS idx_user_practices_question_id ON user_practices(question_id);
CREATE INDEX IF NOT EXISTS idx_user_practices_created_at ON user_practices(created_at);

-- 完成提示
SELECT 'Database structure created successfully!' as message;
