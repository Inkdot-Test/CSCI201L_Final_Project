package servlets;

import java.io.IOException;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import entity.JsonResponse;
import repositories.DatabaseManager;
import userAuthUtil.Util;

@WebServlet("/api/register")
public class UserRegister extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		HttpSession session = request.getSession();

		String username = request.getParameter("username");
		String password = request.getParameter("password");
		String confirmation = request.getParameter("confirmation");

		if (username == null || username.isEmpty()) {
			response.getWriter().append(new JsonResponse("error", "Username cannot be blank.").toJson());
			return;
		}

		if (password == null || password.isEmpty()) {
			response.getWriter().append(new JsonResponse("error", "Password cannot be blank.").toJson());
			return;
		}

		if (confirmation == null || confirmation.isEmpty()) {
			response.getWriter().append(new JsonResponse("error", "You need to confirm password.").toJson());
			return;
		}

		if (!confirmation.equals(password)) {
			response.getWriter().append(new JsonResponse("error", "Two passwords does not match.").toJson());
			return;
		}

		boolean ValidUser = DatabaseManager.validateUsername(username);

		if (ValidUser) {
			response.getWriter().append(new JsonResponse("error", "Username " + username + " already exists.").toJson());
			return;
		} else {
			String salt = UUID.randomUUID().toString();
			String hash = Util.sha256Digest(password + salt);
			DatabaseManager.register(username, hash, salt);

			response.getWriter().append(new JsonResponse("ok", null).toJson());

			session.setAttribute("username", username);
		}
	}
}
