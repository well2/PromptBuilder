namespace PromptBuilder.Core.Interfaces
{
    /// <summary>
    /// Service for interacting with Language Models
    /// </summary>
    public interface ILlmService
    {
        /// <summary>
        /// Send a prompt to the LLM and get a response
        /// </summary>
        /// <param name="prompt">The prompt to send</param>
        /// <param name="model">The model to use</param>
        /// <returns>Response from the LLM</returns>
        Task<string> GetCompletionAsync(string prompt, string model);
    }
}
