import type { ContentPack } from '../../domain/contracts';

// Sources verified in docs/tasks/MW-TEAM-03/SOURCES.json.
// Cross-pack IDs resolve through the single integrated registry.
export const aiEngineerPack: ContentPack = {
  "schemaVersion": 1,
  "contentVersion": "2026-10-06.mw-team-03.2",
  "pathId": "ai-engineer",
  "reviewStatus": "review",
  "stages": [
    {
      "id": "ai-engineer.llm",
      "title": "LLM, context và adapter",
      "phase": "foundation",
      "description": "Tokens/context/limitations và model adapter.",
      "outcome": "Adapter offline hoặc API có budget.",
      "prerequisiteIds": [
        "ml.neural",
        "scientist.responsible-data"
      ],
      "resourceIds": [
        "ai-engineer.resource.llm",
        "ai-engineer.resource.gemini"
      ],
      "defaultResourceId": "ai-engineer.resource.llm",
      "optional": false,
      "work": [
        {
          "id": "ai-engineer.llm.prompts",
          "revision": 1,
          "title": "Tạo prompt và expected behavior",
          "minutes": 90,
          "acceptance": [
            "10 prompt gồm thiếu context/ngoài phạm vi; ghi expected behavior.",
            "Ghi context assumptions; phân biệt generated answer với fact có nguồn."
          ]
        },
        {
          "id": "ai-engineer.llm.adapter",
          "revision": 1,
          "title": "Viết fake model và optional API adapter",
          "minutes": 120,
          "acceptance": [
            "Offline test timeout/429/error; API thật nếu dùng cần env/model/usage.",
            "Max output và budget cấu hình; không key trong repo/hứa API luôn miễn phí."
          ]
        }
      ]
    },
    {
      "id": "ai-engineer.retrieval",
      "title": "Chunk, embedding và retrieval",
      "phase": "build",
      "description": "Corpus có provenance, semantic và lexical baseline.",
      "outcome": "Retrieval có ground truth/Recall@k.",
      "prerequisiteIds": [
        "ai-engineer.llm"
      ],
      "resourceIds": [
        "ai-engineer.resource.embeddings",
        "ai-engineer.resource.retrieval",
        "ml.resource.text-features"
      ],
      "defaultResourceId": "ai-engineer.resource.embeddings",
      "optional": false,
      "work": [
        {
          "id": "ai-engineer.retrieval.index",
          "revision": 1,
          "title": "Index 12 tài liệu ngắn được phép",
          "minutes": 120,
          "acceptance": [
            "Chunk giữ docId/source/offset, model nhỏ CPU có license/version.",
            "Checksum corpus/index, không vector DB hosted bắt buộc."
          ]
        },
        {
          "id": "ai-engineer.retrieval.recall",
          "revision": 1,
          "title": "So semantic search và TF-IDF",
          "minutes": 90,
          "acceptance": [
            "10 queries relevant doc IDs; báo Recall@3 hai phương pháp.",
            "Case ngoài corpus/Unicode/duplicate; không mặc định semantic tốt hơn."
          ]
        }
      ]
    },
    {
      "id": "ai-engineer.rag.pipeline",
      "title": "RAG, trích dẫn và từ chối",
      "phase": "build",
      "description": "Retrieved context giới hạn và grounded answer.",
      "outcome": "Q&A có citations resolve được.",
      "prerequisiteIds": [
        "ai-engineer.retrieval"
      ],
      "resourceIds": [
        "ai-engineer.resource.retrieval",
        "ai-engineer.resource.gemini"
      ],
      "defaultResourceId": "ai-engineer.resource.retrieval",
      "optional": false,
      "work": [
        {
          "id": "ai-engineer.rag.pipeline.citations",
          "revision": 1,
          "title": "Pipeline retrieval/answer/citations",
          "minutes": 120,
          "acceptance": [
            "Fake model offline; citation resolve doc/chunk thực.",
            "Không nhận citation ngoài context; xuất nguồn/đoạn chứng cứ."
          ]
        },
        {
          "id": "ai-engineer.rag.pipeline.abstain",
          "revision": 1,
          "title": "Test thiếu chứng cứ và injection",
          "minutes": 90,
          "acceptance": [
            "5 query không có đáp án trả từ chối; instruction trong tài liệu không thực thi.",
            "Tách instruction/data, kiểm tra context limit và đường dẫn."
          ]
        }
      ]
    },
    {
      "id": "ai-engineer.rag-evaluation",
      "title": "Đánh giá RAG và budget",
      "phase": "ship",
      "description": "Retrieval/answer tách riêng; prompt version/latency.",
      "outcome": "20 case và tradeoff report.",
      "prerequisiteIds": [
        "ai-engineer.rag.pipeline"
      ],
      "resourceIds": [
        "ai-engineer.resource.retrieval",
        "ml.resource.model-card"
      ],
      "defaultResourceId": "ai-engineer.resource.retrieval",
      "optional": false,
      "work": [
        {
          "id": "ai-engineer.rag-evaluation.golden",
          "revision": 1,
          "title": "Chạy 20 case RAG gắn nhãn",
          "minutes": 120,
          "acceptance": [
            "Answerable/unanswerable/injection; Recall@3/citation validity/từ chối đúng.",
            "Lưu expected/actual/prompt version; mock không chứng minh chất lượng LLM thật."
          ]
        },
        {
          "id": "ai-engineer.rag-evaluation.tradeoff",
          "revision": 1,
          "title": "So hai chunk/top-k configs",
          "minutes": 90,
          "acceptance": [
            "Cùng case, metric/latency/token ước lượng hoặc usage API thật.",
            "3 failure modes/budget người học đặt, không bịa giá token."
          ]
        }
      ]
    },
    {
      "id": "ai-engineer.tools",
      "title": "Tool schema và quyền thực thi",
      "phase": "build",
      "description": "Validate args, allowlist/idempotency.",
      "outcome": "Hai tool local có test lỗi.",
      "prerequisiteIds": [
        "ai-engineer.llm"
      ],
      "resourceIds": [
        "ai-engineer.resource.function-calling"
      ],
      "defaultResourceId": "ai-engineer.resource.function-calling",
      "optional": false,
      "work": [
        {
          "id": "ai-engineer.tools.schema",
          "revision": 1,
          "title": "Tools lookup và calculator có schema",
          "minutes": 120,
          "acceptance": [
            "Lookup chỉ corpus, calculator phép toán allowlist; validate args.",
            "Không eval/shell/path tùy ý; tool lạ/sai kiểu có lỗi rõ."
          ]
        },
        {
          "id": "ai-engineer.tools.repeat",
          "revision": 1,
          "title": "Test timeout và gọi tool lặp",
          "minutes": 90,
          "acceptance": [
            "Timeout/exception xử lý; action giả lập request ID không chạy hai lần.",
            "Trace bỏ secrets; fake model không mở quyền tool."
          ]
        }
      ]
    },
    {
      "id": "ai-engineer.agent-loop",
      "title": "Agent loop có điểm dừng",
      "phase": "build",
      "description": "Model/tool/observation với giới hạn.",
      "outcome": "Agent offline có trace kiểm chứng.",
      "prerequisiteIds": [
        "ai-engineer.tools"
      ],
      "resourceIds": [
        "ai-engineer.resource.agents"
      ],
      "defaultResourceId": "ai-engineer.resource.agents",
      "optional": false,
      "work": [
        {
          "id": "ai-engineer.agent-loop.loop",
          "revision": 1,
          "title": "Loop agent tối đa 5 bước",
          "minutes": 120,
          "acceptance": [
            "Fake model lookup/calculator, trace tool/result/final.",
            "Dừng final/timeout/max_steps; không loop vô hạn khi lỗi."
          ]
        },
        {
          "id": "ai-engineer.agent-loop.limits",
          "revision": 1,
          "title": "Test retry, budget và input lỗi",
          "minutes": 90,
          "acceptance": [
            "Tool lỗi/call lặp/thiếu data/model schema sai có case.",
            "Retry giới hạn, budget/steps giữ đúng; không side effect ra ngoài."
          ]
        }
      ]
    },
    {
      "id": "ai-engineer.agent-evaluation",
      "title": "Đánh giá và policy agent",
      "phase": "ship",
      "description": "Success/tool correctness/steps và permission.",
      "outcome": "20 case agent có trace và failure report.",
      "prerequisiteIds": [
        "ai-engineer.agent-loop"
      ],
      "resourceIds": [
        "ai-engineer.resource.agent-evaluation",
        "ai-engineer.resource.function-calling"
      ],
      "defaultResourceId": "ai-engineer.resource.agent-evaluation",
      "optional": false,
      "work": [
        {
          "id": "ai-engineer.agent-evaluation.suite",
          "revision": 1,
          "title": "Chạy 20 nhiệm vụ agent local",
          "minutes": 120,
          "acceptance": [
            "Có multi-step/missing/injection/tool error/duplicate.",
            "Báo success/steps/latency, lưu trace không chỉ chấm final text."
          ]
        },
        {
          "id": "ai-engineer.agent-evaluation.policy",
          "revision": 1,
          "title": "Test 5 yêu cầu vượt quyền",
          "minutes": 90,
          "acceptance": [
            "Shell/network/write bị từ chối hoặc chờ xác nhận, không thực thi.",
            "Ghi mock limits; HF benchmark optional không thay test nội bộ."
          ]
        }
      ]
    },
    {
      "id": "ai-engineer.delivery",
      "title": "Bàn giao ứng dụng AI local",
      "phase": "ship",
      "description": "CLI/config/license/report và optional API.",
      "outcome": "Repo nhánh RAG/agent chạy offline.",
      "prerequisiteIds": [
        "ai-engineer.llm"
      ],
      "resourceIds": [
        "ml.resource.model-card",
        "ai-engineer.resource.gemini"
      ],
      "defaultResourceId": "ml.resource.model-card",
      "optional": false,
      "work": [
        {
          "id": "ai-engineer.delivery.package",
          "revision": 1,
          "title": "Đóng gói CLI và fixtures",
          "minutes": 120,
          "acceptance": [
            "Một lệnh CLI/suite của nhánh chọn; input sai báo rõ.",
            "README Python/model/license, env example không secret."
          ]
        },
        {
          "id": "ai-engineer.delivery.review",
          "revision": 1,
          "title": "Viết báo cáo demo và giới hạn",
          "minutes": 90,
          "acceptance": [
            "Gắn 20 case RAG hoặc agent, failure modes/config.",
            "Nếu mock ghi rõ; API thật ghi usage/cost từ account, không giả production."
          ]
        }
      ]
    }
  ],
  "resources": [
    {
      "id": "ai-engineer.resource.llm",
      "title": "Introduction to large language models",
      "provider": "Google",
      "url": "https://developers.google.com/machine-learning/crash-course/llm",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Module miễn phí; cần nền ML/neural network. Đọc không cần API/GPU; bài bắt đầu bằng đáp án cố định offline.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "ai-engineer.resource.embeddings",
      "title": "Semantic textual similarity",
      "provider": "Sentence Transformers",
      "url": "https://www.sbert.net/docs/sentence_transformer/usage/semantic_textual_similarity.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; sentence-transformers/model nhỏ public CPU; tải weights cần Internet/license, không API trả tiền.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "ai-engineer.resource.retrieval",
      "title": "Semantic search",
      "provider": "Sentence Transformers",
      "url": "https://www.sbert.net/examples/sentence_transformer/applications/semantic-search/README.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; corpus nhỏ CPU local, không cần vector DB hosted; chunk giữ ID/nguồn.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "ai-engineer.resource.gemini",
      "title": "Gemini API getting started",
      "provider": "Google",
      "url": "https://ai.google.dev/gemini-api/docs/get-started",
      "language": "en",
      "format": "article",
      "cost": "mixed",
      "level": "intermediate",
      "accessNote": "Đọc miễn phí; gọi thật cần account/key và khu vực hỗ trợ. Free tier tùy model/quota; paid tier tính usage. Mock/offline là mặc định bài, API thật tùy chọn; key ở env.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "ai-engineer.resource.function-calling",
      "title": "Gemini function calling",
      "provider": "Google",
      "url": "https://ai.google.dev/gemini-api/docs/function-calling",
      "language": "en",
      "format": "article",
      "cost": "mixed",
      "level": "intermediate",
      "accessNote": "Đọc miễn phí; Gemini thật cần key/quota và có paid tier. Bài fake model trả tool call local; không cấp quyền shell hay dữ liệu cá nhân.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "ai-engineer.resource.agents",
      "title": "What is an agent?",
      "provider": "Hugging Face",
      "url": "https://huggingface.co/learn/agents-course/en/unit1/what-are-agents",
      "language": "en",
      "format": "course",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Khóa đọc miễn phí; cần Python/LLM. Bài local có tool allowlist/fake model; Hub/Spaces/certificate cần account HF; inference/GPU ngoài có thể mất phí.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "ai-engineer.resource.agent-evaluation",
      "title": "Agents Course final hands-on",
      "provider": "Hugging Face",
      "url": "https://huggingface.co/learn/agents-course/en/unit4/hands-on",
      "language": "en",
      "format": "exercise",
      "cost": "mixed",
      "level": "advanced",
      "accessNote": "Đọc/challenge khóa miễn phí; submit cần account HF. API/model/hosting tùy cách chạy có thể tốn phí. Bài nội bộ 20 case offline không tự nhận certificate.",
      "checkedAt": "2026-10-06"
    }
  ],
  "credentials": [
    {
      "id": "ai-engineer.credential.hf-agents",
      "name": "Hugging Face Agents Course Certificate (tùy chọn)",
      "provider": "Hugging Face",
      "kind": "course_certificate",
      "url": "https://huggingface.co/learn/agents-course/en/unit4/get-your-certificate",
      "cost": "free",
      "prerequisites": "Python/LLM và account HF; hoàn thành Unit 1, use case và final challenge theo khóa. Certificate miễn phí, model/API/compute ngoài có thể tốn phí.",
      "requirements": "Trang claim yêu cầu điểm final challenge trên 30%, đăng nhập/cung cấp tên để verify/download. 20 test local không tương đương benchmark, không tự nhận đã đạt.",
      "checkedAt": "2026-10-06"
    }
  ],
  "tracks": [
    {
      "id": "ai-engineer.rag",
      "pathId": "ai-engineer",
      "label": "LLM / RAG với Python",
      "stageIds": [
        "scientist.foundation.python",
        "scientist.arrays",
        "scientist.tables",
        "scientist.statistics",
        "scientist.math",
        "scientist.evaluation",
        "scientist.responsible-data",
        "ml.neural",
        "ai-engineer.llm",
        "ai-engineer.retrieval",
        "ai-engineer.rag.pipeline",
        "ai-engineer.rag-evaluation",
        "ai-engineer.delivery"
      ],
      "credentialIds": [],
      "roadmapLinks": [
        {
          "label": "Khung học chính thức theo chủ đề",
          "url": "https://www.sbert.net/examples/sentence_transformer/applications/semantic-search/README.html"
        }
      ],
      "portfolio": {
        "title": "Q&A corpus local có trích dẫn",
        "acceptance": [
          "12 tài liệu được phép; chunk provenance/checksum/citation resolve được.",
          "10 ground-truth retrieval queries, TF-IDF/semantic Recall@3.",
          "20 answerable/unanswerable/injection cases, citation validity/từ chối đúng.",
          "Offline mock tái lập; optional API có timeout/quota/budget, ghi rõ mock vs real model."
        ]
      }
    },
    {
      "id": "ai-engineer.agents",
      "pathId": "ai-engineer",
      "label": "Tools / agent với Python",
      "stageIds": [
        "scientist.foundation.python",
        "scientist.arrays",
        "scientist.tables",
        "scientist.statistics",
        "scientist.math",
        "scientist.evaluation",
        "scientist.responsible-data",
        "ml.neural",
        "ai-engineer.llm",
        "ai-engineer.tools",
        "ai-engineer.agent-loop",
        "ai-engineer.agent-evaluation",
        "ai-engineer.delivery"
      ],
      "credentialIds": [
        "ai-engineer.credential.hf-agents"
      ],
      "roadmapLinks": [
        {
          "label": "Khung học chính thức theo chủ đề",
          "url": "https://huggingface.co/learn/agents-course/en/unit1/what-are-agents"
        }
      ],
      "portfolio": {
        "title": "Agent local có allowlist và trace",
        "acceptance": [
          "Lookup/calculator validate args, không shell/eval/path tùy ý; repeated action không chạy hai lần.",
          "Loop tối đa 5 bước/timeout/final, retry/budget giới hạn.",
          "20 tasks expected/actual/trace; tool lỗi/missing/injection/schema cases.",
          "CLI offline/card model/prompt/version/license; certificate HF là mục tiêu chưa đạt."
        ]
      }
    }
  ]
};
