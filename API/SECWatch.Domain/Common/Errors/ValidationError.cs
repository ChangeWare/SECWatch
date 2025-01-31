using FluentResults;

namespace SECWatch.Domain.Common.Errors;

public class ValidationError(string message) : Error(message);