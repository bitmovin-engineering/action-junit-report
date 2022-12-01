import { Annotation } from './testParser'

/**
 * Limit output, because we use it to send a message to Slack inside a section
 * that is limited to 3000 chars and already contains some other text.
 */
const defaultOutputCharLimit = 2500

/**
 * Limit number of tests that are displayed, otherwise the Slack message will
 * get too big and will just be less readable.
 * For cases where there is a lot of failing tests in-depth review of the run will be needed anyway.
 */
const defaultMaxTestsToOutput = 8

/**
 * Takes @param annotations and returns a markdown-formatted string
 * of failing test titles and descriptions separated by new line chars.
 */
export function generateFailedTestsReport(
  annotations: Annotation[],
  outputCharLimit: number = defaultOutputCharLimit,
  maxTestsToOutput: number = defaultMaxTestsToOutput
): String {
  const failedTestAnnotations = annotations.filter(annotation => annotation.annotation_level == 'failure')

  let output = failedTestAnnotations
    .slice(0, maxTestsToOutput)
    .map(annotation => formatAnnotation(annotation))
    .join('\\n')

  const ignoredTestsCount = failedTestAnnotations.length - maxTestsToOutput
  if (ignoredTestsCount > 0) {
    output += `\\n\\n+ additional *${ignoredTestsCount}* failed tests.`
  }

  // In rare cases where output is over 3000 chars long
  // just slice it so that Slack message step in the CI doesn't fail.
  return output.slice(0, outputCharLimit)
}

function formatAnnotation(annotation: Annotation): String {
  const title = annotation.title
  const description = annotation
    .message
    .replace(/\n/g, '\\n')
    .replace(/"/g, '\\"')

  const formattedTitle = `*${title}*`
  const formattedDescription = `\`\`\`${description}\`\`\``
  return `${formattedTitle}\\n${formattedDescription}`
}
