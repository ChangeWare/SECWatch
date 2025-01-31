using FluentResults;

namespace SECWatch.Domain.Common.Errors;

public class InternalError(string message) : Error(message)
{
    
}