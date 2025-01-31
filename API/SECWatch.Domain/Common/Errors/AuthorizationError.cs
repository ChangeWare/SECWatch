using FluentResults;

namespace SECWatch.Domain.Common.Errors;

public class AuthorizationError(string message) : Error(message);