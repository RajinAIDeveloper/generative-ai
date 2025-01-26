import { Brain, Eye, MessageSquare, Mic, Table2, Target, Network } from 'lucide-react';

export const categories = {
    'Multimodal AI': {
      icon: Brain,
      color: "bg-violet-600", 
      route: "/models/multimodal",
      description: "Unified systems processing multiple data types simultaneously - text, images, and audio"
    },
    'Computer Vision': {
      icon: Eye,
      color: "bg-cyan-600",
      route: "/models/vision",
      description: "Advanced image and video processing for object detection, segmentation, and scene understanding"
    },
    'Natural Language Processing': {
      icon: MessageSquare,
      color: "bg-emerald-600",
      route: "/models/nlp", 
      description: "Text understanding, generation, and translation powered by transformers"
    },
    'Audio': {
      icon: Mic,
      color: "bg-rose-600",
      route: "/models/audio",
      description: "Speech recognition, synthesis, and sound analysis using deep learning"
    },
    'Tabular': {
      icon: Table2,
      color: "bg-amber-600",
      route: "/models/tabular",
      description: "Machine learning for structured data analysis and prediction"
    },
    'Reinforcement Learning': {
      icon: Target,
      color: "bg-fuchsia-600",
      route: "/models/rl",
      description: "AI agents learning through interaction and reward optimization"
    },
    'Graph Machine Learning': {
      icon: Network,
      color: "bg-blue-600",
      route: "/models/graph",
      description: "Neural networks for analyzing relationships and network structures"
    }
   };

   export const models = {
    'Multimodal AI': [
      {
        title: "Audio-Text-to-Text",
        description: "Convert audio and text inputs to textual outputs",
        category: "multimodal"
      },
      {
        title: "Image-Text-to-Text", 
        description: "Generate text from combined image and text inputs",
        category: "multimodal"
      },
      {
        title: "Visual Question Answering",
        description: "Answer questions about images using natural language",
        category: "multimodal"
      },
      {
        title: "Document Question Answering",
        description: "Extract answers from documents based on questions",
        category: "multimodal"
      },
      {
        title: "Video-Text-to-Text",
        description: "Generate text descriptions from video and text inputs",
        category: "multimodal"
      },
      {
        title: "Any-to-Any",
        description: "Convert between multiple modalities flexibly",
        category: "multimodal"
      }
    ],
    'Computer Vision': [
      {
        title: "Image-Text-to-Text", 
        description: "Generate text from combined image and text inputs",
        category: "vision"
      },
      {
        title: "Depth Estimation",
        description: "Predict depth information from 2D images",
        category: "vision"
      },
      {
        title: "Image Classification",
        description: "Categorize images into predefined classes",
        category: "vision"
      },
      {
        title: "Object Detection",
        description: "Identify and locate objects within images",
        category: "vision"
      },
      {
        title: "Image Segmentation",
        description: "Partition images into semantically meaningful parts",
        category: "vision"
      },
      {
        title: "Text-to-Image",
        description: "Generate images from textual descriptions",
        category: "vision"
      },
      {
        title: "Image-to-Text",
        description: "Generate textual descriptions of images",
        category: "vision"
      },
      {
        title: "Image-to-Image",
        description: "Transform images while preserving key characteristics",
        category: "vision"
      },
      {
        title: "Image-to-Video",
        description: "Generate video sequences from still images",
        category: "vision"
      },
      {
        title: "Unconditional Image Generation",
        description: "Create novel images without specific prompts",
        category: "vision"
      },
      {
        title: "Video Classification",
        description: "Categorize videos into predefined classes",
        category: "vision"
      },
      {
        title: "Text-to-Video",
        description: "Generate video content from text descriptions",
        category: "vision"
      },
      {
        title: "Zero-Shot Image Classification",
        description: "Classify images into unseen categories",
        category: "vision"
      },
      {
        title: "Mask Generation",
        description: "Create masks for image segmentation tasks",
        category: "vision"
      },
      {
        title: "Zero-Shot Object Detection",
        description: "Detect objects without prior training examples",
        category: "vision"
      },
      {
        title: "Text-to-3D",
        description: "Generate 3D models from text descriptions",
        category: "vision"
      },
      {
        title: "Image-to-3D",
        description: "Create 3D models from 2D images",
        category: "vision"
      },
      {
        title: "Image Feature Extraction",
        description: "Extract meaningful features from images",
        category: "vision"
      },
      {
        title: "Keypoint Detection",
        description: "Identify key points and landmarks in images",
        category: "vision"
      },
      {
        title: "Visual Question Answering",
        description: "Answer questions about images using natural language",
        category: "vision"
      },
      {
        title: "Document Question Answering",
        description: "Extract answers from documents based on questions",
        category: "vision"
      },
      {
        title: "Video-Text-to-Text",
        description: "Generate text descriptions from video and text inputs",
        category: "vision"
      }
    ],
    'Natural Language Processing': [
      {
        title: "Sentiment Analysis",
        description: "Analyze text sentiment and emotion",
        category: "nlp"
      },
      
      {
        title: "Token Classification",
        description: "Label individual tokens in text sequences",
        category: "nlp"
      },
      {
        title: "Table Question Answering",
        description: "Answer questions about tabular data",
        category: "nlp"
      },
      {
        title: "Question Answering",
        description: "Generate answers to natural language questions",
        category: "nlp"
      },
      {
        title: "Zero-Shot Classification",
        description: "Classify text without specific training examples",
        category: "nlp"
      },
      {
        title: "Translation",
        description: "Convert text between different languages",
        category: "nlp"
      },
      {
        title: "Summarization",
        description: "Generate concise summaries of longer texts",
        category: "nlp"
      },
      {
        title: "Feature Extraction",
        description: "Extract meaningful features from text",
        category: "nlp"
      },
      {
        title: "Text Generation",
        description: "Create coherent text from prompts",
        category: "nlp"
      },
      {
        title: "Text2Text Generation",
        description: "Transform text while preserving meaning",
        category: "nlp"
      },
      {
        title: "Fill-Mask",
        description: "Complete masked tokens in text sequences",
        category: "nlp"
      },
      {
        title: "Sentence Similarity",
        description: "Measure semantic similarity between sentences",
        category: "nlp"
      }
    ],
    'Audio': [
      {
        title: "Text-to-Speech",
        description: "Convert text into natural-sounding speech",
        category: "audio"
      },
      {
        title: "Text-to-Audio",
        description: "Generate audio content from text descriptions",
        category: "audio"
      },
      {
        title: "Automatic Speech Recognition",
        description: "Convert speech into text transcriptions",
        category: "audio"
      },
      {
        title: "Audio-to-Audio",
        description: "Transform audio while preserving key characteristics",
        category: "audio"
      },
      {
        title: "Audio Classification",
        description: "Categorize audio into predefined classes",
        category: "audio"
      },
      {
        title: "Voice Activity Detection",
        description: "Detect presence of human speech in audio",
        category: "audio"
      }
    ],
    'Tabular': [
      {
        title: "Tabular Classification",
        description: "Classify rows in structured data tables",
        category: "tabular"
      },
      {
        title: "Tabular Regression",
        description: "Predict continuous values from tabular data",
        category: "tabular"
      },
      {
        title: "Time Series Forecasting",
        description: "Predict future values in time series data",
        category: "tabular"
      }
    ],
    'Reinforcement Learning': [
      {
        title: "Reinforcement Learning",
        description: "Train agents through environment interaction",
        category: "rl"
      },
      {
        title: "Robotics",
        description: "Control robotic systems through learning",
        category: "rl"
      }
    ],
    'Graph Machine Learning': [
      {
        title: "Graph Machine Learning",
        description: "Analyze and learn from graph-structured data",
        category: "graph"
      }
    ]
   };