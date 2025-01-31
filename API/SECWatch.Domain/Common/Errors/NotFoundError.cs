using FluentResults;

namespace SECWatch.Domain.Common.Errors;

public class NotFoundError(string message) : Error(message);