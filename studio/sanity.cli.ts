/**
 * Sanity CLI Configuration
 * This file configures the Sanity CLI tool with project-specific settings
 * and customizes the Vite bundler configuration.
 * Learn more: https://www.sanity.io/docs/cli
 */

import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '<your project ID>'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost: process.env.SANITY_STUDIO_STUDIO_HOST || '', // Visit https://www.sanity.io/docs/studio/environment-variables to learn more about using environment variables for local & production.
  deployment: {
    // Deployed at https://ashagereh.sanity.studio — the id keeps `sanity deploy`
    // from prompting for it.
    appId: 'casisggxy6idzk0u6tqbj3og',
    autoUpdates: true,
  },
  /**
   * lexorank (via @sanity/orderable-document-list) is CommonJS, and the CLI
   * loads the studio config through a Vite SSR worker that inlines every
   * dependency — which makes CJS blow up on `exports is not defined`. Keeping
   * it external lets Node require it as the CJS module it is.
   */
  vite: (config) => ({
    ...config,
    ssr: {
      ...config.ssr,
      external: [...((config.ssr?.external as string[]) ?? []), 'lexorank'],
    },
  }),
  typegen: {
    path: './src/**/*.{ts,tsx,js,jsx}',
    schema: '../sanity.schema.json',
    generates: './sanity.types.ts',
    overloadClientMethods: true,
  },
})
