#ifndef WEB_SOCKETS_SERVER_H_
#define WEB_SOCKETS_SERVER_H_

#include <map>
#include "WebServer.h"

namespace csci3081 {

class WebServerSession;
class WebServerCommand;

struct WebServerSessionState {
    std::map<std::string, WebServerCommand*> commands;
};

class WebServerCommand {
public:
    virtual ~WebServerCommand() {}

    virtual void execute(WebServerSession* session, picojson::value& command, WebServerSessionState* state);
    virtual void execute(WebServerSession* session, picojson::object& command, WebServerSessionState* state, picojson::object& data) = 0;
};

class WebServerSession : public JSONSession {
public:
    WebServerSession(WebServerSessionState state) : state(state) {
    }
    ~WebServerSession() {
    }
    void receiveJSON(picojson::value& val) {
        std::string cmd = val.get<picojson::object>()["command"].get<std::string>();
        std::cout << cmd << std::endl;
        std::map<std::string, WebServerCommand*>::iterator it = state.commands.find(cmd);
        if (it != state.commands.end()) {
            it->second->execute(this, val, &state);
        }
    }
    void update() {}

private:
    WebServerSessionState state;
};

void WebServerCommand::execute(WebServerSession* session, picojson::value& command, WebServerSessionState* state) {
        picojson::object data;
        picojson::object cmd = command.get<picojson::object>();
        data["id"] = cmd["id"];
        execute(session, cmd, state, data);
        picojson::value ret(data);
        session->sendJSON(ret);
}

}

#endif