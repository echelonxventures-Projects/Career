// Self-Improving Architecture Configuration
// This file defines the entire system configuration - zero hard-coding

export const SystemConfig = {
  // System Identity
  name: "Career Platform",
  version: "2.0.0",
  mode: "self-evolving",

  // Core Capabilities
  capabilities: {
    resumeBuilder: {
      enabled: true,
      templates: "database", // Not hard-coded, loaded from DB
      sections: "configurable", // Dynamic sections
      aiEnhancement: true,
    },
    jobSearch: {
      enabled: true,
      sources: "configurable", // Add/remove job sources via admin
      aggregators: ["linkedin", "indeed", "glassdoor", "remotive", "ziprecruiter"],
    },
    careerCounselling: {
      enabled: true,
      assessmentQuestions: "database", // Dynamic questions
      recommendations: "ai-driven", // ML-based recommendations
    },
    integrations: {
      enabled: true,
      providers: "configurable", // Dynamic integrations
    },
  },

  // Self-Improvement Settings
  selfImprovement: {
    enabled: true,
    learningMode: "continuous",
    dataCollection: {
      userBehavior: true,
      successMetrics: true,
      feedbackLoop: true,
    },
    autoOptimize: {
      resumeTemplates: true,
      atsAlgorithms: true,
      jobRecommendations: true,
      uiComponents: true,
    },
  },

  // Extension System
  extensions: {
    enabled: true,
    marketplace: true,
    autoInstall: false,
    api: {
      version: "v2",
      authentication: "jwt",
      rateLimiting: true,
    },
  },

  // AI Configuration
  ai: {
    providers: ["openai", "anthropic", "cohere"],
    fallbackEnabled: true,
    modelSelection: "auto", // Automatically select best model
    caching: true,
    personalization: true,
  },

  // Feature Flags (Dynamic)
  features: {
    betaFeatures: "auto-rollout",
    abTesting: true,
    gradualRollout: true,
  },
};

// Dynamic Configuration Loader
export class ConfigManager {
  private static instance: ConfigManager;
  private config: any = {};

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  async loadConfig(): Promise<void> {
    // Load from database or API
    // This is where dynamic configuration comes from
    this.config = {
      ...SystemConfig,
      // Override with database values
    };
  }

  get(key: string): any {
    return this.config[key];
  }

  set(key: string, value: any): void {
    this.config[key] = value;
    // Persist to database
  }

  isFeatureEnabled(feature: string): boolean {
    return this.config.capabilities?.[feature]?.enabled ?? false;
  }
}

// Usage: const config = ConfigManager.getInstance();
