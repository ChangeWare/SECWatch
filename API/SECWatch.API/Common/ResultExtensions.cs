using FluentResults;
using Microsoft.AspNetCore.Mvc;
using SECWatch.Domain.Common.Errors;

namespace SECWatch.API.Common;

public static class ResultExtensions
{
    private static ActionResult ToErrorResult(IError error)
    {
        return error switch
        {
            NotFoundError => new NotFoundObjectResult(new { message = error.Message }),
            ValidationError => new BadRequestObjectResult(new { message = error.Message }),
            AuthorizationError => new ForbidResult(error.Message),
            InternalError => new ObjectResult(new { message = error.Message })
            {
                StatusCode = StatusCodes.Status500InternalServerError
            },
            _ => new ObjectResult(new { message = "An unexpected error occurred" }) 
            { 
                StatusCode = StatusCodes.Status500InternalServerError 
            }
        };
    }

    public static ActionResult ToActionResult(this Result result) 
    {
        if (result.IsSuccess)
        {
            return new NoContentResult();
        }

        return ToErrorResult(result.Errors.First());
    }

    public static ActionResult<TResponse> ToActionResponse<T, TResponse>(
        this Result<T> result,
        Func<T, TResponse> responseFactory)
    {
        if (result.IsSuccess)
        {
            return new OkObjectResult(responseFactory(result.Value));
        }

        return new ActionResult<TResponse>(ToErrorResult(result.Errors.First()));
    }
    
}