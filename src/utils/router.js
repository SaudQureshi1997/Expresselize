import { Router, Response } from "express";
import { formatter } from "@utils/validator";
import ValidationException from "@exceptions/ValidationException";
import HttpException from "@exceptions/HttpException";
import logger from "@utils/logger"

const router = Router();

/**
 *
 * @param {String} path
 * @returns {String}
 */
const prependSlash = (path) => {
  path = path.trim("/");
  return "/".concat(path);
};

/**
 *
 * @param {Response} res
 * @returns {Response}
 */
const addCustomMethodsToResponse = (res) => {
  return res;
};

/**
 *
 * @param {String} method
 * @param {String} path
 * @param {Function} callback
 * @param {Array} middlewares
 */
const registerRoute = (method, path, callback, middlewares) => {
  path = prependSlash(path);
  router[method](path, ...middlewares, async (req, res, next) => {
    try {
      res = addCustomMethodsToResponse(res);
      return await callback({ req, res, next, logger });
    } catch (err) {
      const code = err instanceof HttpException ? err.code : 500;
      const error =
        err instanceof ValidationException
          ? formatter(err.errors)
          : { error: err.message };

      if (!err instanceof ValidationException) {
        logger.error({
          err,
          code,
          trace: err.stack,
        });
      }

      return res.status(code).json(error);
    }
  });
};

/**
 *
 * @param {String} prefix
 * @param {Function} callback
 * @param {Array} middlewares
 */
const group = (prefix, callback, middlewares = []) => {
  prefix = prefix == "/" ? "" : prefix.trim("/");
  const nestRoute = (method, path, _callback, extraMiddlewares = []) => {
    path = path == "/" ? "" : path.trim("/");
    path = [prefix, path].filter((e) => e.length > 0).join("/");
    registerRoute(
      method,
      path,
      _callback,
      middlewares.concat(extraMiddlewares)
    );
  };

  callback({
    post: (path, callback, extraMiddlewares = []) =>
      nestRoute("post", path, callback, extraMiddlewares),
    get: (path, callback, extraMiddlewares = []) =>
      nestRoute("get", path, callback, extraMiddlewares),
    put: (path, callback, extraMiddlewares = []) =>
      nestRoute("put", path, callback, extraMiddlewares),
    patch: (path, callback, extraMiddlewares = []) =>
      nestRoute("patch", path, callback, extraMiddlewares),
    _delete: (path, callback, extraMiddlewares = []) =>
      nestRoute("_delete", path, callback, extraMiddlewares),
    group: (path, callback, extraMiddlewares = []) =>
      group(prefix.concat(path), callback, extraMiddlewares),
  });
};

/**
 *
 * @param {String} path
 * @param {Function} callback
 * @param {Array} middlewares
 */
const post = (path, callback, middlewares = []) =>
  registerRoute("post", path, callback, middlewares);

/**
 *
 * @param {String} path
 * @param {Function} callback
 * @param {Array} middlewares
 */
const get = (path, callback, middlewares = []) =>
  registerRoute("get", path, callback, middlewares);

/**
 *
 * @param {String} path
 * @param {Function} callback
 * @param {Array} middlewares
 */
const put = (path, callback, middlewares = []) =>
  registerRoute("put", path, callback, middlewares);

/**
 *
 * @param {String} path
 * @param {Function} callback
 * @param {Array} middlewares
 */
const patch = (path, callback, middlewares = []) =>
  registerRoute("patch", path, callback, middlewares);

/**
 *
 * @param {String} path
 * @param {Function} callback
 * @param {Array} middlewares
 */
const _delete = (path, callback, middlewares = []) =>
  registerRoute("delete", path, callback, middlewares);

/**
 * @returns {Array}
 */
const list = () => router.stack.filter(r => r.route).map(r => ({path: r.route.path, method: r.route.methods}));

export { router, post, get, put, patch, _delete, group, list };
