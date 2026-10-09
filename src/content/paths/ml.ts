import type { ContentPack } from '../../domain/contracts';

// Sources verified in docs/tasks/MW-TEAM-03/SOURCES.json.
// Cross-pack IDs resolve through the single integrated registry.
export const mlPack: ContentPack = {
  "schemaVersion": 1,
  "contentVersion": "2026-10-06.mw-team-03.2",
  "pathId": "ml",
  "reviewStatus": "review",
  "stages": [
    {
      "id": "ml.classical.models",
      "title": "Supervised với scikit-learn",
      "phase": "build",
      "description": "Linear/tree cùng split và preprocessing.",
      "outcome": "So model có baseline và metric.",
      "prerequisiteIds": [
        "scientist.evaluation"
      ],
      "resourceIds": [
        "ml.resource.classifiers"
      ],
      "defaultResourceId": "ml.resource.classifiers",
      "optional": false,
      "work": [
        {
          "id": "ml.classical.models.compare",
          "revision": 1,
          "title": "So LogisticRegression và RandomForest",
          "minutes": 120,
          "acceptance": [
            "Cùng 3-fold CV train; bảng mean/std F1 cho Dummy/linear/tree.",
            "Ghi seed/config/thời gian, không chọn bằng test."
          ]
        },
        {
          "id": "ml.classical.models.errors",
          "revision": 1,
          "title": "Phân tích lỗi theo feature",
          "minutes": 90,
          "acceptance": [
            "5 lỗi và ít nhất một failure slice.",
            "Không diễn giải importance là quan hệ nhân quả."
          ]
        }
      ]
    },
    {
      "id": "ml.classical.tuning",
      "title": "Tuning và cross-validation",
      "phase": "build",
      "description": "Search nhỏ và holdout kín.",
      "outcome": "Search có config/CV/final evaluation.",
      "prerequisiteIds": [
        "ml.classical.models"
      ],
      "resourceIds": [
        "ml.resource.tuning"
      ],
      "defaultResourceId": "ml.resource.tuning",
      "optional": false,
      "work": [
        {
          "id": "ml.classical.tuning.search",
          "revision": 1,
          "title": "GridSearchCV trong Pipeline",
          "minutes": 120,
          "acceptance": [
            "Tối đa 8 cấu hình/3 folds train; lưu cv_results/best_params.",
            "Preprocessing không dùng test, ghi scoring/n_jobs."
          ]
        },
        {
          "id": "ml.classical.tuning.final",
          "revision": 1,
          "title": "Đánh giá tuned model một lần cuối",
          "minutes": 90,
          "acceptance": [
            "So Dummy/model đầu/tuned trên holdout.",
            "Ghi cả trường hợp không cải thiện; không chỉnh test để tăng điểm."
          ]
        }
      ]
    },
    {
      "id": "ml.classical.unsupervised",
      "title": "Clustering và độ ổn định",
      "phase": "expand",
      "description": "KMeans, chuẩn hóa và đánh giá không nhãn.",
      "outcome": "Clustering có giới hạn được giải thích.",
      "prerequisiteIds": [
        "ml.classical.models"
      ],
      "resourceIds": [
        "ml.resource.clustering"
      ],
      "defaultResourceId": "ml.resource.clustering",
      "optional": true,
      "work": [
        {
          "id": "ml.classical.unsupervised.clusters",
          "revision": 1,
          "title": "So ba k bằng KMeans",
          "minutes": 90,
          "acceptance": [
            "make_blobs/seed cố định, silhouette hợp lệ và biểu đồ.",
            "Không coi cluster ID là nhãn thật."
          ]
        },
        {
          "id": "ml.classical.unsupervised.stability",
          "revision": 1,
          "title": "So ổn định với ba seed",
          "minutes": 60,
          "acceptance": [
            "Báo metric ổn định và sample count.",
            "Nêu tình huống hình dạng dữ liệu không phù hợp KMeans."
          ]
        }
      ]
    },
    {
      "id": "ml.classical.ship",
      "title": "Bàn giao model dữ liệu bảng",
      "phase": "ship",
      "description": "CLI inference và model card.",
      "outcome": "Repo có demo/test/license.",
      "prerequisiteIds": [
        "ml.classical.tuning",
        "scientist.responsible-data"
      ],
      "resourceIds": [
        "ml.resource.model-card"
      ],
      "defaultResourceId": "ml.resource.model-card",
      "optional": false,
      "work": [
        {
          "id": "ml.classical.ship.cli",
          "revision": 1,
          "title": "Đóng gói train/evaluate/predict CLI",
          "minutes": 120,
          "acceptance": [
            "Fixture chạy được, input sai schema bị từ chối.",
            "Lưu model/config/metrics và môi trường."
          ]
        },
        {
          "id": "ml.classical.ship.card",
          "revision": 1,
          "title": "Viết model card và demo",
          "minutes": 90,
          "acceptance": [
            "Intended use, metric, 5 lỗi, data/license/limits.",
            "README tái lập, 5 input demo có output."
          ]
        }
      ]
    },
    {
      "id": "ml.neural",
      "title": "PyTorch và neural network",
      "phase": "foundation",
      "description": "Tensor/autograd và training loop trước CV/NLP/LLM.",
      "outcome": "MLP CPU có checkpoint.",
      "prerequisiteIds": [
        "scientist.math",
        "scientist.evaluation"
      ],
      "resourceIds": [
        "ml.resource.pytorch-basics"
      ],
      "defaultResourceId": "ml.resource.pytorch-basics",
      "optional": false,
      "work": [
        {
          "id": "ml.neural.autograd",
          "revision": 1,
          "title": "Kiểm tra tensor và gradient PyTorch",
          "minutes": 90,
          "acceptance": [
            "Gradient hữu hạn, một gradient so finite difference.",
            "Ghi CPU/seed, phân biệt train/eval mode."
          ]
        },
        {
          "id": "ml.neural.train",
          "revision": 1,
          "title": "Huấn luyện MLP tổng hợp",
          "minutes": 120,
          "acceptance": [
            "Loss train giảm; holdout no_grad; save/load output khớp.",
            "Ghi epoch, RAM và thời gian đo được."
          ]
        }
      ]
    },
    {
      "id": "ml.cv.data",
      "title": "Dữ liệu ảnh và augmentation",
      "phase": "build",
      "description": "Manifest/split theo đối tượng, augmentation train.",
      "outcome": "Ảnh có provenance và split được kiểm tra.",
      "prerequisiteIds": [
        "ml.neural",
        "scientist.responsible-data"
      ],
      "resourceIds": [
        "ml.resource.transfer-learning"
      ],
      "defaultResourceId": "ml.resource.transfer-learning",
      "optional": false,
      "work": [
        {
          "id": "ml.cv.data.manifest",
          "revision": 1,
          "title": "Lập manifest ảnh hai lớp",
          "minutes": 90,
          "acceptance": [
            "Ít nhất 20 ảnh/lớp tự tạo/được phép, source/license rõ.",
            "Split không trùng hash/đối tượng nếu có group."
          ]
        },
        {
          "id": "ml.cv.data.augment",
          "revision": 1,
          "title": "Test DataLoader và transforms",
          "minutes": 90,
          "acceptance": [
            "Batch shape/nhãn đúng; augmentation chỉ train.",
            "Lưu grid trước/sau, normalize test nhất quán."
          ]
        }
      ]
    },
    {
      "id": "ml.cv.transfer",
      "title": "Transfer learning ảnh",
      "phase": "build",
      "description": "Frozen backbone/head, CPU subset nhỏ.",
      "outcome": "Model ảnh với baseline và checkpoint.",
      "prerequisiteIds": [
        "ml.cv.data"
      ],
      "resourceIds": [
        "ml.resource.transfer-learning"
      ],
      "defaultResourceId": "ml.resource.transfer-learning",
      "optional": false,
      "work": [
        {
          "id": "ml.cv.transfer.head",
          "revision": 1,
          "title": "Train head trên backbone freeze",
          "minutes": 120,
          "acceptance": [
            "Sample/epoch giới hạn CPU; chỉ head được update.",
            "Ghi weights/version/license/seed và thời gian; GPU tùy chọn."
          ]
        },
        {
          "id": "ml.cv.transfer.evaluate",
          "revision": 1,
          "title": "Đánh giá holdout ảnh",
          "minutes": 90,
          "acceptance": [
            "So majority baseline bằng F1/confusion matrix.",
            "5 ảnh prediction có đúng/sai; nêu giới hạn sample nhỏ."
          ]
        }
      ]
    },
    {
      "id": "ml.cv.ship",
      "title": "Demo CV và model card",
      "phase": "ship",
      "description": "Inference ảnh ngoài train, input bounds.",
      "outcome": "CLI CPU có test ảnh hỏng.",
      "prerequisiteIds": [
        "ml.cv.transfer"
      ],
      "resourceIds": [
        "ml.resource.model-card",
        "ml.resource.pytorch-basics"
      ],
      "defaultResourceId": "ml.resource.model-card",
      "optional": false,
      "work": [
        {
          "id": "ml.cv.ship.predict",
          "revision": 1,
          "title": "Viết CLI dự đoán ảnh",
          "minutes": 90,
          "acceptance": [
            "Ảnh đúng trả nhãn/score, ảnh hỏng/quá lớn bị chặn.",
            "eval/no_grad; preprocessing như test."
          ]
        },
        {
          "id": "ml.cv.ship.publish",
          "revision": 1,
          "title": "Bàn giao demo CV",
          "minutes": 90,
          "acceptance": [
            "Card license/weights/split/metrics và 3 failure modes.",
            "README CPU command/sample/checklist tái lập."
          ]
        }
      ]
    },
    {
      "id": "ml.nlp.baseline",
      "title": "NLP và TF-IDF baseline",
      "phase": "build",
      "description": "Corpus/nhãn và chống duplicate giữa splits.",
      "outcome": "Baseline văn bản không leakage.",
      "prerequisiteIds": [
        "scientist.evaluation",
        "scientist.responsible-data"
      ],
      "resourceIds": [
        "ml.resource.text-features"
      ],
      "defaultResourceId": "ml.resource.text-features",
      "optional": false,
      "work": [
        {
          "id": "ml.nlp.baseline.corpus",
          "revision": 1,
          "title": "Tạo corpus hai nhãn nhỏ",
          "minutes": 90,
          "acceptance": [
            "60 câu tự viết/được phép; nguồn/schema rõ.",
            "Duplicate không chéo split; có Unicode/rỗng/nhãn lệch."
          ]
        },
        {
          "id": "ml.nlp.baseline.tfidf",
          "revision": 1,
          "title": "Train TF-IDF linear classifier",
          "minutes": 120,
          "acceptance": [
            "Vocabulary fit train; CV train, macro-F1 holdout.",
            "Confusion matrix/5 lỗi; lưu split cho Transformer."
          ]
        }
      ]
    },
    {
      "id": "ml.nlp.transformers",
      "title": "Tokenizer và Transformer NLP",
      "phase": "build",
      "description": "Token/truncation và encoder nhỏ; không train LLM từ đầu.",
      "outcome": "So encoder với baseline trên cùng split.",
      "prerequisiteIds": [
        "ml.nlp.baseline",
        "ml.neural"
      ],
      "resourceIds": [
        "ml.resource.transformers-course",
        "ml.resource.text-classification"
      ],
      "defaultResourceId": "ml.resource.transformers-course",
      "optional": false,
      "work": [
        {
          "id": "ml.nlp.transformers.tokens",
          "revision": 1,
          "title": "Test tokenizer/truncation",
          "minutes": 90,
          "acceptance": [
            "Token IDs/mask cho Unicode/dài/rỗng, assert shape.",
            "Ghi model/version/license/max_length."
          ]
        },
        {
          "id": "ml.nlp.transformers.encoder",
          "revision": 1,
          "title": "Frozen encoder CPU cho classification",
          "minutes": 120,
          "acceptance": [
            "Trích embedding rồi fit head train; holdout như baseline.",
            "Báo macro-F1/latency; giảm batch/subset nếu thiếu RAM, không tự nhận full fine-tune."
          ]
        }
      ]
    },
    {
      "id": "ml.nlp.ship",
      "title": "Audit và bàn giao NLP",
      "phase": "ship",
      "description": "Slice độ dài/ngôn ngữ, inference và card.",
      "outcome": "NLP demo có test/limits.",
      "prerequisiteIds": [
        "ml.nlp.transformers"
      ],
      "resourceIds": [
        "ml.resource.model-card",
        "ml.resource.text-classification"
      ],
      "defaultResourceId": "ml.resource.model-card",
      "optional": false,
      "work": [
        {
          "id": "ml.nlp.ship.slices",
          "revision": 1,
          "title": "Audit theo độ dài văn bản",
          "minutes": 90,
          "acceptance": [
            "Metric/sample count cho ngắn/dài và 5 lỗi.",
            "Ghi có hỗ trợ tiếng Việt không; không kết luận ngoài corpus."
          ]
        },
        {
          "id": "ml.nlp.ship.demo",
          "revision": 1,
          "title": "Đóng gói CLI và model card NLP",
          "minutes": 120,
          "acceptance": [
            "Test Unicode/rỗng/dài, lệnh tái lập.",
            "Card ghi model/license/split, baseline-vs-encoder và giới hạn CPU."
          ]
        }
      ]
    }
  ],
  "resources": [
    {
      "id": "ml.resource.classifiers",
      "title": "Classifier comparison",
      "provider": "scikit-learn",
      "url": "https://scikit-learn.org/stable/auto_examples/classification/plot_classifier_comparison.html",
      "language": "en",
      "format": "exercise",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Ví dụ miễn phí; dữ liệu nhỏ CPU, không GPU/tài khoản.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "ml.resource.tuning",
      "title": "Hyperparameter search",
      "provider": "scikit-learn",
      "url": "https://scikit-learn.org/stable/modules/grid_search.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; giới hạn grid/fold để chạy CPU; test giữ kín tới đánh giá cuối.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "ml.resource.clustering",
      "title": "Clustering",
      "provider": "scikit-learn",
      "url": "https://scikit-learn.org/stable/modules/clustering.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; ma trận đã chuẩn hóa, dữ liệu nhỏ CPU.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "ml.resource.pytorch-basics",
      "title": "Learn the Basics: PyTorch",
      "provider": "PyTorch",
      "url": "https://docs.pytorch.org/tutorials/beginner/basics/intro.html",
      "language": "en",
      "format": "lab",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Tài liệu/notebook miễn phí; Python/PyTorch/TorchVision. Bài nhỏ chạy CPU; Colab cần tài khoản và không đảm bảo GPU miễn phí.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "ml.resource.transfer-learning",
      "title": "Transfer learning for computer vision",
      "provider": "PyTorch",
      "url": "https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html",
      "language": "en",
      "format": "lab",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; tải ảnh/weights cần Internet/license. Tutorial có CPU fallback; bài freeze backbone/sample nhỏ. Thuê GPU/cloud có thể mất phí.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "ml.resource.text-features",
      "title": "Text feature extraction",
      "provider": "scikit-learn",
      "url": "https://scikit-learn.org/stable/modules/feature_extraction.html#text-feature-extraction",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; TF-IDF/linear model CPU, corpus tổng hợp có nhãn.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "ml.resource.transformers-course",
      "title": "Hugging Face LLM Course introduction",
      "provider": "Hugging Face",
      "url": "https://huggingface.co/learn/llm-course/chapter1/1",
      "language": "en",
      "format": "course",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Khóa đọc miễn phí, không quảng cáo; cần Python/nền deep learning. Model nhỏ public cần kiểm tra license; gated model cần tài khoản/chấp thuận riêng.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "ml.resource.text-classification",
      "title": "Transformers text classification",
      "provider": "Hugging Face",
      "url": "https://huggingface.co/docs/transformers/tasks/sequence_classification",
      "language": "en",
      "format": "lab",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; full fine-tune có thể cần GPU. Bài dùng CPU/sample nhỏ/frozen encoder; ghi RAM/thời gian. Cloud/GPU thuê có thể mất phí.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "ml.resource.model-card",
      "title": "Model cards",
      "provider": "Hugging Face",
      "url": "https://huggingface.co/docs/hub/model-cards",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; viết card local không tài khoản. Upload Hub cần tài khoản; không upload dữ liệu riêng tư.",
      "checkedAt": "2026-10-06"
    }
  ],
  "credentials": [],
  "tracks": [
    {
      "id": "ml.classical",
      "pathId": "ml",
      "label": "scikit-learn",
      "stageIds": [
        "scientist.foundation.python",
        "scientist.arrays",
        "scientist.tables",
        "scientist.statistics",
        "scientist.math",
        "scientist.evaluation",
        "scientist.responsible-data",
        "ml.classical.models",
        "ml.classical.tuning",
        "ml.classical.unsupervised",
        "ml.classical.ship"
      ],
      "credentialIds": [
        "scientist.credential.ml-specialization"
      ],
      "roadmapLinks": [
        {
          "label": "Khung học chính thức theo chủ đề",
          "url": "https://scikit-learn.org/stable/auto_examples/classification/plot_classifier_comparison.html"
        }
      ],
      "portfolio": {
        "title": "Classification bảng với baseline/tuning",
        "acceptance": [
          "Pipeline preprocess/model không leakage; split/seed/config được lưu.",
          "So Dummy/linear/tree và search CV có log; test đánh giá cuối.",
          "CLI predict có schema/NaN tests, latency/5 lỗi/model card.",
          "Clustering là mở rộng optional; không dùng cluster label làm ground truth."
        ]
      }
    },
    {
      "id": "ml.cv",
      "pathId": "ml",
      "label": "Computer Vision / PyTorch",
      "stageIds": [
        "scientist.foundation.python",
        "scientist.arrays",
        "scientist.tables",
        "scientist.statistics",
        "scientist.math",
        "scientist.evaluation",
        "scientist.responsible-data",
        "ml.neural",
        "ml.cv.data",
        "ml.cv.transfer",
        "ml.cv.ship"
      ],
      "credentialIds": [],
      "roadmapLinks": [
        {
          "label": "Khung học chính thức theo chủ đề",
          "url": "https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html"
        }
      ],
      "portfolio": {
        "title": "Phân loại ảnh hai lớp bằng transfer learning",
        "acceptance": [
          "Manifest license/source và split không trùng hash/đối tượng.",
          "Frozen backbone/head với checkpoint/seed, majority baseline và F1/confusion matrix.",
          "CLI CPU test ảnh đúng/hỏng/quá lớn; 5 ảnh demo/metric holdout.",
          "Card weights/license, RAM/thời gian đo thật và 3 failure modes."
        ]
      }
    },
    {
      "id": "ml.nlp",
      "pathId": "ml",
      "label": "NLP / Transformers",
      "stageIds": [
        "scientist.foundation.python",
        "scientist.arrays",
        "scientist.tables",
        "scientist.statistics",
        "scientist.math",
        "scientist.evaluation",
        "scientist.responsible-data",
        "ml.neural",
        "ml.nlp.baseline",
        "ml.nlp.transformers",
        "ml.nlp.ship"
      ],
      "credentialIds": [],
      "roadmapLinks": [
        {
          "label": "Khung học chính thức theo chủ đề",
          "url": "https://huggingface.co/learn/llm-course/chapter1/1"
        }
      ],
      "portfolio": {
        "title": "Phân loại văn bản TF-IDF và Transformer",
        "acceptance": [
          "Corpus license/schema, không duplicate chéo split.",
          "TF-IDF/frozen encoder cùng holdout; macro-F1/latency.",
          "Test Unicode/rỗng/dài; slices có sample count và 5 lỗi.",
          "Card model/version/ngôn ngữ/CPU limits; không tự nhận full fine-tune."
        ]
      }
    }
  ]
};
