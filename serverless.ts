import type { AWS } from "@serverless/typescript";

import hello from "@functions/hello";

const serverlessConfiguration: Omit<AWS, "provider"> & {
  provider: Omit<AWS["provider"], "vpc"> & {
    vpc: { securityGroupIds: string; subnetIds: string };
  };
} = {
  service: "serverless-v3-template",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    architecture: "arm64",
    region: "ap-northeast-2",
    stage: "dev",
    logRetentionInDays: 14,
    deploymentBucket: "",
    stackName: "${self:service}-stack-${sls:stage}",
    httpApi: {
      id: "",
    },
    vpc: {
      securityGroupIds: "",
      subnetIds: "",
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },

  // import the function via paths
  functions: { hello },

  package: {
    individually: true,
    excludeDevDependencies: true,
  },

  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node20",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
